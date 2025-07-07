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

    const supabase = await createSupabaseServer();

    // 🔥 CAMBIO CRÍTICO: Buscar la orden existente usando external_reference
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

    // Buscar la orden existente por su ID (que debería estar en external_reference)
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", externalReference)
      .single();

    if (fetchError || !existingOrder) {
      console.error(
        `Error al buscar la orden ${externalReference} en Supabase:`,
        fetchError
      );
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // 🔥 ACTUALIZAR la orden existente (no crear una nueva)
    const updateData = {
      status:
        paymentDetails.status === "approved" ? "pagado" : paymentDetails.status,
      payment_id_mp: paymentDetails.id,
    };

    console.log("Datos a actualizar en Supabase:", updateData);

    // Actualizar la orden existente
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", externalReference)
      .select()
      .single();

    if (updateError) {
      console.error("Error al actualizar la orden en Supabase:", updateError);
      return NextResponse.json(
        { message: "Error al actualizar la orden" },
        { status: 500 }
      );
    }

    console.log("Orden actualizada exitosamente:", updatedOrder);

    // Log adicional para debug
    console.log(
      `Orden ${externalReference} actualizada de estado '${existingOrder.status}' a '${updateData.status}'`
    );

    return NextResponse.json(
      {
        message: "Webhook procesado exitosamente",
        orderId: externalReference,
        oldStatus: existingOrder.status,
        newStatus: updateData.status,
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
