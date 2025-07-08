import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const webhookBody = await req.json();

    const paymentId = webhookBody.data?.id || webhookBody.id;

    if (!paymentId) {
      console.error(
        "No se encontró el ID de pago en la notificación del webhook:",
        webhookBody
      );

      return NextResponse.json(
        { message: "ID de pago no encontrado" },
        { status: 400 }
      );
    }

    const MERCADO_PAGO_API_URL = `https://api.mercadopago.com/v1/payments/${paymentId}`;

    const ML_ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

    if (!ML_ACCESS_TOKEN) {
      console.error(
        "ML_ACCESS_TOKEN no está definido en las variables de entorno."
      );

      return NextResponse.json(
        { message: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    const response = await fetch(MERCADO_PAGO_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ML_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `Error al obtener detalles del pago de Mercado Pago: ${response.status} - ${errorText}`
      );

      return NextResponse.json(
        { message: "Error al verificar el pago con Mercado Pago" },
        { status: 500 }
      );
    }

    const paymentDetails = await response.json();

    console.log("Detalles del pago obtenidos de Mercado Pago:", paymentDetails);

    // AQUÍ ESTÁ EL CAMBIO CLAVE: Usar external_reference en lugar de payment_id
    const orderId = paymentDetails.external_reference;

    if (!orderId) {
      console.error(
        "No se encontró external_reference en el pago:",
        paymentDetails
      );
      return NextResponse.json(
        { message: "External reference no encontrado" },
        { status: 400 }
      );
    }

    // Mapear el status de MercadoPago a tu sistema
    let orderStatus = paymentDetails.status;

    // Opcional: Mapear estados específicos
    if (paymentDetails.status === "approved") {
      orderStatus = "pagado";
    } else if (paymentDetails.status === "rejected") {
      orderStatus = "rechazado";
    } else if (paymentDetails.status === "pending") {
      orderStatus = "pendiente";
    }

    const orderToUpdate = {
      status: orderStatus,
      payment_id_mp: paymentId, // Guardar el payment_id para referencia
      // Opcional: guardar más datos del pago
      payment_method: paymentDetails.payment_method_id,
      transaction_amount: paymentDetails.transaction_amount,
      updated_at: new Date().toISOString(),
    };

    console.log("Objeto a actualizar en Supabase:", orderToUpdate);
    console.log("Buscando orden con ID:", orderId);

    const supabase = await createSupabaseServer();

    // CAMBIO CLAVE: Buscar por ID de orden, no por payment_intent_id
    const { data: orderData, error: supabaseError } = await supabase
      .from("orders")
      .update(orderToUpdate)
      .eq("id", orderId) // Buscar por ID de orden
      .select() // Agregar select para obtener los datos actualizados
      .single();

    if (supabaseError) {
      console.error("Error al actualizar la orden en Supabase:", supabaseError);

      return NextResponse.json(
        { message: "Error al actualizar la orden" },
        { status: 500 }
      );
    }

    console.log("Payment ID:", paymentId);
    console.log("Order ID:", orderId);
    console.log("Orden actualizada exitosamente en Supabase:", orderData);

    return NextResponse.json(
      { message: "Webhook procesado exitosamente", order: orderData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error general en el procesamiento del webhook:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
