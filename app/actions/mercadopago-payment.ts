// app/actions/mercadopago-payment.ts
"use server";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server";
import { createOrder, OrderData } from "./transfer-orders";
import process from "process";

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export async function mercadopagoPayment(orderData: OrderData) {
  try {
    // Crear orden en Supabase ANTES de MercadoPago
    const orderCreationResult = await createOrder(orderData);

    if (!orderCreationResult.success) {
      console.error("Failed to create order:", orderCreationResult.error);
      return { success: false, error: orderCreationResult.error, url: null };
    }

    const orderId = orderCreationResult.orderId;
    console.log("📝 Orden creada con ID:", orderId, "Tipo:", typeof orderId);

    const supabase = await createSupabaseServer();

    // Preparar items para MercadoPago
    const itemsForMercadoPago = orderData.items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
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

    const preference = new Preference(client);

    const preferenceResponse = await preference.create({
      body: {
        items: itemsForMercadoPago,
        // 🔥 CRÍTICO: Asegurar que external_reference sea STRING
        external_reference: String(orderId), // ← FORZAR A STRING
        payer: {
          name: orderData.customerInfo.firstName,
          surname: orderData.customerInfo.lastName,
          email: orderData.customerInfo.email,
          phone: {
            area_code: "",
            number: orderData.customerInfo.phone,
          },
          address: {
            street_name: orderData.customerInfo.address,
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
        // 🔥 AGREGAR WEBHOOK NOTIFICATION URL
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
      },
    });

    const preferenceId = preferenceResponse.id;
    const paymentUrl = preferenceResponse.init_point;

    console.log("💳 MercadoPago creado:", {
      preferenceId,
      orderId,
      external_reference: String(orderId),
    });

    // Actualizar orden con preference ID
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_intent_id: preferenceId,
        status: "pending_payment",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error(
        "❌ Error updating order with MP preference ID:",
        updateError
      );
      return {
        success: true,
        url: paymentUrl,
        orderId: orderId,
        warning: "Order updated with MP ID failed",
      };
    }

    console.log("✅ Orden actualizada a pending_payment");

    return {
      success: true,
      url: paymentUrl,
      orderId: orderId,
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
