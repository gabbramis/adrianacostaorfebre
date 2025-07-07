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

    // 🔥 USAR UPSERT PARA EVITAR RACE CONDITIONS
    // Esto actualiza si existe, o crea si no existe
    const newStatus =
      paymentDetails.status === "approved" ? "pagado" : paymentDetails.status;

    // Solo procesar si el pago está aprobado o hay un cambio de estado significativo
    if (
      paymentDetails.status !== "approved" &&
      paymentDetails.status !== "rejected"
    ) {
      console.log(
        `⏭️  Webhook ignorado. Estado no final: ${paymentDetails.status}`
      );
      return NextResponse.json(
        { message: "Estado de pago no final" },
        { status: 200 }
      );
    }

    const updateData = {
      status: newStatus,
      payment_id_mp: String(paymentDetails.id), // Forzar a string
      updated_at: new Date().toISOString(),
    };

    console.log("🔄 Actualizando orden via webhook:", {
      orderId: externalReference,
      newStatus: newStatus,
      paymentId: paymentDetails.id,
    });

    // 🔥 USAR UPDATE CON RETURNING PARA VERIFICAR SI LA ACTUALIZACIÓN FUE EXITOSA
    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", externalReference)
      .eq("status", "pending_payment"); // Solo actualizar si está en pending

    if (updateError) {
      // Si no se pudo actualizar, podría ser porque ya fue actualizada
      console.log(
        "ℹ️  No se pudo actualizar via webhook, verificando estado actual:",
        updateError
      );

      // Verificar el estado actual
      const { data: currentOrder, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", externalReference)
        .single();

      if (fetchError || !currentOrder) {
        console.error(
          `❌ Error al buscar la orden ${externalReference}:`,
          fetchError
        );
        return NextResponse.json(
          { message: "Orden no encontrada" },
          { status: 404 }
        );
      }

      // Si ya está actualizada, está bien
      if (
        currentOrder.status === newStatus &&
        currentOrder.payment_id_mp === String(paymentDetails.id)
      ) {
        console.log("✅ Orden ya actualizada por otro proceso");
        return NextResponse.json(
          {
            message: "Webhook procesado - orden ya actualizada",
            orderId: externalReference,
            status: newStatus,
          },
          { status: 200 }
        );
      }

      // Si no, intentar actualizar sin restricción de estado
      const { error: forceUpdateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", externalReference);

      if (forceUpdateError) {
        console.error("❌ Error al forzar actualización:", forceUpdateError);
        return NextResponse.json(
          { message: "Error al actualizar la orden" },
          { status: 500 }
        );
      }

      console.log("✅ Orden actualizada exitosamente (forzada)");
    } else {
      console.log("✅ Orden actualizada exitosamente via webhook");
    }

    return NextResponse.json(
      {
        message: "Webhook procesado exitosamente",
        orderId: externalReference,
        status: newStatus,
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
