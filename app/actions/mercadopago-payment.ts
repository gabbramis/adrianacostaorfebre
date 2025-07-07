// app/actions/mercadopago-payment.ts
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server";
import { createOrder, OrderData } from "./transfer-orders";
import process from "process";

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export async function mercadopagoPayment(orderData: OrderData) {
  try {
    // 🔥 VERIFICAR SI YA EXISTE UNA ORDEN PARA EVITAR DUPLICADOS
    const supabase = await createSupabaseServer();

    // Generar un ID único basado en el timestamp y datos del usuario
    const uniqueId = `${Date.now()}-${orderData.customerInfo.email.replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("🆔 Generando orden con ID único:", uniqueId);

    // Crear orden en Supabase ANTES de MercadoPago
    const orderCreationResult = await createOrder({
      ...orderData,
      // Asegurar que el ID sea único si tu createOrder lo permite
      uniqueReference: uniqueId,
    });

    if (!orderCreationResult.success) {
      console.error("Failed to create order:", orderCreationResult.error);
      return { success: false, error: orderCreationResult.error, url: null };
    }

    const orderId = orderCreationResult.orderId;
    console.log("📝 Orden creada con ID:", orderId, "Tipo:", typeof orderId);

    // 🔥 ASEGURAR QUE EL ORDER ID SEA CONSISTENTE
    const stringOrderId = String(orderId);

    // Preparar items para MercadoPago
    const itemsForMercadoPago = orderData.items.map((item) => ({
      id: String(item.id), // Asegurar que sea string
      title: item.name.substring(0, 256), // MercadoPago tiene límite de caracteres
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: "UYU",
    }));

    if (orderData.shippingCost > 0) {
      itemsForMercadoPago.push({
        id: "SHIPPING_COST",
        title: "Costo de Envío",
        quantity: 1,
        unit_price: Number(orderData.shippingCost),
        currency_id: "UYU",
      });
    }

    if (itemsForMercadoPago.length === 0) {
      return {
        success: false,
        error: "No items or valid shipping cost to process payment.",
        url: null,
      };
    }

    // 🔥 VALIDAR QUE EL TOTAL SEA CORRECTO
    const totalAmount = itemsForMercadoPago.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    console.log("💰 Total calculado:", totalAmount);

    const preference = new Preference(client);

    const preferenceResponse = await preference.create({
      body: {
        items: itemsForMercadoPago,
        // 🔥 CRÍTICO: Asegurar que external_reference sea STRING y único
        external_reference: stringOrderId,
        payer: {
          name: orderData.customerInfo.firstName.substring(0, 256),
          surname: orderData.customerInfo.lastName.substring(0, 256),
          email: orderData.customerInfo.email,
          phone: {
            area_code: "",
            number: orderData.customerInfo.phone,
          },
          address: {
            street_name: orderData.customerInfo.address.substring(0, 256),
            street_number: "",
            zip_code: orderData.customerInfo.postalCode,
          },
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-pending`,
        },
        auto_return: "approved",
        // 🔥 CONFIGURAR WEBHOOK CORRECTAMENTE
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
        // 🔥 AGREGAR CONFIGURACIONES ADICIONALES
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(), // 24 horas
      },
    });

    const preferenceId = preferenceResponse.id;
    const paymentUrl = preferenceResponse.init_point;

    console.log("💳 MercadoPago preference creada:", {
      preferenceId,
      orderId: stringOrderId,
      external_reference: stringOrderId,
      paymentUrl,
    });

    // 🔥 ACTUALIZAR ORDEN CON DATOS DE MERCADOPAGO
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_intent_id: preferenceId,
        status: "pending_payment",
        updated_at: new Date().toISOString(),
      })
      .eq("id", stringOrderId)
      .select()
      .single();

    if (updateError) {
      console.error(
        "❌ Error updating order with MP preference ID:",
        updateError
      );
      return {
        success: false,
        error: "Error al actualizar la orden con MercadoPago",
        url: null,
      };
    }

    console.log("✅ Orden actualizada a pending_payment:", updatedOrder);

    return {
      success: true,
      url: paymentUrl,
      orderId: stringOrderId,
      preferenceId: preferenceId,
    };
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("❌ Error in Mercado Pago payment processing:", error);
    return { success: false, error: errorMessage, url: null };
  }
}
