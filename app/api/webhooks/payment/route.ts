// pages/api/mercadopago/webhook.ts
import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const webhookBody = await req.json();

    // 1. Validar que es una notificación de pago.
    if (webhookBody.type && webhookBody.type !== "payment") {
      console.log(
        "Webhook recibido pero no es de tipo payment:",
        webhookBody.type
      );
      return NextResponse.json(
        { message: "Webhook no es de tipo payment" },
        { status: 200 } // Siempre devolver 200 para que MP no reintente
      );
    }

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

    console.log("Procesando webhook para payment ID:", paymentId);

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

    // 2. Obtener los detalles completos del pago de Mercado Pago.
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
    console.log("Detalles del pago obtenidos de Mercado Pago:", {
      id: paymentDetails.id,
      status: paymentDetails.status,
      external_reference: paymentDetails.external_reference,
      transaction_amount: paymentDetails.transaction_amount,
    });

    const orderId = paymentDetails.external_reference;

    if (!orderId) {
      console.error(
        "No se encontró external_reference en el pago:",
        paymentDetails.id
      );
      return NextResponse.json(
        { message: "No se encontró referencia de orden en el pago" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // 3. Verificar que la orden existe en Supabase.
    //    Es importante seleccionar el status actual para la lógica de actualización.
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, payment_id_mp") // También selecciona payment_id_mp
      .eq("id", orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error(
        `Orden ${orderId} no encontrada en la base de datos:`,
        fetchError
      );
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // 4. Determinar el nuevo status basado en el estado de Mercado Pago.
    let newStatus: string;

    switch (paymentDetails.status) {
      case "approved":
        newStatus = "pagado"; // Mantener "pagado" para consistencia con tu admin panel
        break;
      case "pending":
        newStatus = "pending_payment";
        break;
      case "rejected":
      case "cancelled":
        newStatus = "cancelled";
        break;
      case "refunded":
        newStatus = "refunded";
        break;
      default:
        console.warn(`Estado de pago desconocido: ${paymentDetails.status}`);
        newStatus = "pending_payment"; // Default a pendiente si es desconocido
    }

    // 5. Lógica de idempotencia y actualización del estado.
    //    Solo actualizar si el estado ha cambiado O si el payment_id_mp no está establecido
    //    (en caso de que la orden se creara sin él inicialmente y este sea el primer webhook).
    if (
      existingOrder.status === newStatus &&
      existingOrder.payment_id_mp === String(paymentDetails.id)
    ) {
      console.log(
        `Orden ${orderId} ya tiene el estado ${newStatus} y payment_id_mp ${paymentDetails.id}. No se requiere actualización.`
      );
      return NextResponse.json(
        {
          message: "Estado ya actualizado",
          orderId: orderId,
          status: newStatus,
        },
        { status: 200 }
      );
    }

    // ACTUACIÓN CLAVE: Actualizar la orden existente con los detalles del pago.
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        payment_id_mp: String(paymentDetails.id), // Asegurarse de guardar el ID de pago de MP
        mp_payment_status: paymentDetails.status,
        mp_payment_method: paymentDetails.payment_method_id,
        mp_transaction_amount: paymentDetails.transaction_amount,
        mp_currency: paymentDetails.currency_id,
        mp_date_approved: paymentDetails.date_approved,
        mp_payer_email: paymentDetails.payer?.email,
        mp_payer_id: paymentDetails.payer?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error al actualizar la orden en Supabase:", updateError);
      return NextResponse.json(
        { message: "Error al actualizar la orden" },
        { status: 500 }
      );
    }

    console.log(
      `Orden ${orderId} actualizada exitosamente de ${existingOrder.status} a ${newStatus}`
    );

    // OPCIONAL: Enviar notificación por email si el pago fue aprobado
    if (newStatus === "pagado") {
      // Usar newStatus para la condición
      console.log(
        `✅ Pago aprobado para orden ${orderId}. Considera enviar email de confirmación.`
      );
      // Aquí podrías llamar a tu servicio de email
    }

    return NextResponse.json(
      {
        message: "Webhook procesado exitosamente",
        orderId: orderId,
        previousStatus: existingOrder.status,
        newStatus: newStatus,
        paymentStatus: paymentDetails.status,
      },
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
