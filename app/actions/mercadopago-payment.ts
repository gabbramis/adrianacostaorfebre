// app/actions/mercadopago-payment.ts (o donde sea que esté)
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server";
import { createOrder, OrderData } from "./transfer-orders"; // Asegúrate de que createOrder es robusta
import process from "process";

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export async function mercadopagoPayment(orderData: OrderData) {
  try {
    // 1. Crear la orden en Supabase ANTES de crear la preferencia de MP.
    //    Es CRÍTICO que createOrder sea idempotente o que la lógica de tu frontend
    //    asegure que solo se llama una vez por intento de compra legítimo.
    //    Por ejemplo, si ya existe una orden "pending" para el mismo carrito/usuario,
    //    reutilizarla o lanzar un error.
    const orderCreationResult = await createOrder(orderData);

    if (!orderCreationResult.success) {
      console.error(
        "Failed to create order before Mercado Pago preference:",
        orderCreationResult.error
      );
      return { success: false, error: orderCreationResult.error, url: null };
    }

    const orderId = orderCreationResult.orderId;
    const supabase = await createSupabaseServer();

    // Preparar items para Mercado Pago (sin cambios)
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
        external_reference: orderId, // <-- CRÍTICO: Vincula tu orderId con MP
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
          // Asegúrate de que estas URLs de redirección sean correctas
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/payment-pending`,
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`, // <-- CRÍTICO: Tu webhook
        auto_return: "approved",
        statement_descriptor: "TU_TIENDA",
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    });

    const preferenceId = preferenceResponse.id;
    const paymentUrl = preferenceResponse.init_point;

    console.log("Mercado Pago Preference ID:", preferenceId);
    console.log("Mercado Pago Payment URL:", paymentUrl);

    // 2. Actualizar la orden con el preference ID y establecer el estado inicial de pago
    //    Este estado es el que el webhook usará como "estado anterior" para decidir si actualizar.
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_intent_id: preferenceId,
        status: "pending_payment", // <-- Estado inicial cuando se genera la preferencia
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with MP preference ID:", updateError);
      // Considerar si esto es un error fatal o solo una advertencia.
      // Si la preferencia se creó, el usuario puede seguir pagando.
      return {
        success: true,
        url: paymentUrl,
        orderId: orderId,
        warning: "Order updated with MP ID failed",
      };
    }

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
    console.error("Error in Mercado Pago payment processing:", error);
    return { success: false, error: errorMessage, url: null };
  }
}
