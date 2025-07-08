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

    const orderToUpdate = {
      status: paymentDetails.status,
    };

    // Imprime el objeto que vas a insertar para verificar que esté bien formado
    console.log("Objeto a insertar en Supabase:", orderToUpdate);

    // Llamada a supabase
    const supabase = await createSupabaseServer();

    // Insertar el record
    const { data: orderData, error: supabaseError } = await supabase
      .from("orders")
      .update(orderToUpdate)
      .eq("payment_intent_id", paymentDetails.id);

    if (supabaseError) {
      console.error("Error al actualizar la orden en Supabase:", supabaseError);
      return NextResponse.json(
        { message: "Error al guardar la orden" },
        { status: 500 }
      );
    }

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
