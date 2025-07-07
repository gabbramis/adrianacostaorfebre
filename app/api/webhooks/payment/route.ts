import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const webhookBody = await req.json();
    const paymentId = webhookBody.data?.id || webhookBody.id;

    console.log("🔔 Webhook recibido:", {
      action: webhookBody.action,
      type: webhookBody.type,
      paymentId: paymentId,
      fullBody: webhookBody,
    });

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

    // 🔥 FILTRAR SOLO EVENTOS DE PAGO RELEVANTES
    // MercadoPago envía muchos webhooks, solo procesamos los importantes
    const relevantActions = ["payment.created", "payment.updated"];
    if (webhookBody.action && !relevantActions.includes(webhookBody.action)) {
      console.log(`⏭️  Webhook ignorado. Acción: ${webhookBody.action}`);
      return NextResponse.json(
        { message: "Webhook ignorado - acción no relevante" },
        { status: 200 }
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
    console.log("💳 Detalles del pago obtenidos:", {
      id: paymentDetails.id,
      status: paymentDetails.status,
      external_reference: paymentDetails.external_reference,
      transaction_amount: paymentDetails.transaction_amount,
    });

    const supabase = await createSupabaseServer();
    const externalReference = paymentDetails.external_reference;

    if (!externalReference) {
      console.error(
        "No se encontró external_reference en el pago:",
        paymentDetails
      );
      return NextResponse.json(
        { message: "external_reference no encontrado" },
        { status: 400 }
      );
    }

    // Buscar la orden existente
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", externalReference)
      .single();

    if (fetchError || !existingOrder) {
      console.error(
        `❌ Error al buscar la orden ${externalReference}:`,
        fetchError
      );
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // 🔥 PREVENIR ACTUALIZACIONES DUPLICADAS
    // Solo actualizar si el estado realmente cambió
    const newStatus =
      paymentDetails.status === "approved" ? "pagado" : paymentDetails.status;
    const currentPaymentId = existingOrder.payment_id_mp;

    if (
      currentPaymentId === paymentDetails.id &&
      existingOrder.status === newStatus
    ) {
      console.log(
        `⏭️  Orden ${externalReference} ya está actualizada. Estado: ${newStatus}, Payment ID: ${currentPaymentId}`
      );
      return NextResponse.json(
        {
          message: "Webhook procesado - sin cambios necesarios",
          orderId: externalReference,
          status: newStatus,
        },
        { status: 200 }
      );
    }

    // Actualizar solo si hay cambios
    const updateData = {
      status: newStatus,
      payment_id_mp: paymentDetails.id,
      updated_at: new Date().toISOString(), // Agregar timestamp
    };

    console.log("🔄 Actualizando orden:", {
      orderId: externalReference,
      from: existingOrder.status,
      to: newStatus,
      paymentId: paymentDetails.id,
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", externalReference)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error al actualizar la orden:", updateError);
      return NextResponse.json(
        { message: "Error al actualizar la orden" },
        { status: 500 }
      );
    }

    console.log("✅ Orden actualizada exitosamente:", {
      orderId: externalReference,
      oldStatus: existingOrder.status,
      newStatus: newStatus,
      paymentStatus: paymentDetails.status,
    });

    return NextResponse.json(
      {
        message: "Webhook procesado exitosamente",
        orderId: externalReference,
        oldStatus: existingOrder.status,
        newStatus: newStatus,
        paymentStatus: paymentDetails.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error general en el procesamiento del webhook:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
