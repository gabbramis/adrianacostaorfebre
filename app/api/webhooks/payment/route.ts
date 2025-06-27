import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
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

    const orderToInsert = {
      mp_payment_id: paymentDetails.id,

      total_amount: paymentDetails.transaction_amount, // Monto total de la transacción
      currency: paymentDetails.currency_id, // Moneda (ej. UYU)
      status: paymentDetails.status, // Estado del pago (ej. 'approved')
      description: paymentDetails.description, // Descripción del pago (ej. 'Checkout')
      payment_method_id: paymentDetails.payment_method_id, // Método de pago (ej. 'account_money')
      created_at: paymentDetails.date_created, // Fecha de creación del pago
      approved_at: paymentDetails.date_approved, // Fecha de aprobación del pago
      payer_email: paymentDetails.payer?.email, // Email del comprador (usa optional chaining ?. por si no existe)
      payer_id: paymentDetails.payer?.id, // ID del comprador en MP
    };

    // Imprime el objeto que vas a insertar para verificar que esté bien formado
    console.log("Objeto a insertar en Supabase:", orderToInsert);

    // Llamada a supabase
    const supabase = await createSupabaseServer();

    // Insertar el record
    const { data: orderData, error: supabaseError } = await supabase
      .from("orders")
      .insert(orderToInsert);

    if (supabaseError) {
      console.error("Error al insertar la orden en Supabase:", supabaseError);
      return NextResponse.json(
        { message: "Error al guardar la orden" },
        { status: 500 }
      );
    }

    console.log("Orden guardada exitosamente en Supabase:", orderData);

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
