// app/actions/mercadopago-payment.ts
"use server";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server";
import { createOrder, OrderData } from "./transfer-orders"; // Import OrderData type

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

// We need to pass the OrderData to this function so we can create the order in Supabase
// and link the Mercado Pago preference to it.
export async function mercadopagoPayment(orderData: OrderData) {
  try {
    // IMPORTANT: Create the order in Supabase BEFORE creating the Mercado Pago preference
    // This way, you have an order ID to link the payment preference to.
    const orderCreationResult = await createOrder(orderData); // Call your existing createOrder action

    if (!orderCreationResult.success) {
      console.error(
        "Failed to create order before Mercado Pago preference:",
        orderCreationResult.error
      );
      return { success: false, error: orderCreationResult.error, url: null };
    }

    const orderId = orderCreationResult.orderId;
    const supabase = await createSupabaseServer();

    // Prepare items for Mercado Pago preference from OrderData
    const itemsForMercadoPago = orderData.items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      // You can add more details like currency_id if needed
      currency_id: "UYU",
    }));
    if (orderData.shippingCost > 0) {
      // Only add if there's a positive shipping cost
      itemsForMercadoPago.push({
        id: "SHIPPING_COST", // A unique ID for shipping
        title: "Costo de Envío", // Descriptive title
        quantity: 1, // Always 1 unit of shipping
        unit_price: Number(orderData.shippingCost), // The actual shipping cost
        currency_id: "UYU", // Same currency as other items
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
        // Add external_reference to link the Mercado Pago preference to your internal order ID
        external_reference: orderId,
        payer: {
          name: orderData.customerInfo.firstName,
          surname: orderData.customerInfo.lastName,
          email: orderData.customerInfo.email,
          phone: {
            area_code: "", // Extract area code if available
            number: orderData.customerInfo.phone,
          },
          address: {
            street_name: orderData.customerInfo.address, // Consider breaking this down later
            street_number: "", // Extract if available
            zip_code: orderData.customerInfo.postalCode,
          },
        },
      },
    });

    const preferenceId = preferenceResponse.id;
    const paymentUrl = preferenceResponse.init_point; // Use a more descriptive name

    console.log("Mercado Pago Preference ID:", preferenceId);
    console.log("Mercado Pago Payment URL:", paymentUrl);

    // Update the order in Supabase with the Mercado Pago preference ID
    // and set its status to something like 'pending_payment_mp'
    const { error: updateError } = await supabase
      .from("orders") // Your orders table
      .update({
        payment_intent_id: preferenceId,
        status: "pending_payment", // Or 'pending_mercadopago'
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with MP preference ID:", updateError);
      // You might want to log this but still return the URL to the user
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
  } catch (error: any) {
    console.error("Error in Mercado Pago payment processing:", error);
    return { success: false, error: error.message, url: null };
  }
}
