// app/actions/order-actions.ts
"use server";

import { createSupabaseServer } from "@/utils/supabase/server";

// ---
// Define your interfaces for clarity and type safety
// ---

// CartItem remains largely the same, but 'id' should match your product_id type (UUID or BIGINT)
export interface CartItem {
  id: string; // Ensure this matches your 'products.id' type (e.g., UUID string)
  name: string;
  price: number;
  quantity: number;
  // Add any other properties of your cart items here (e.g., variant_details)
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string; // This should be broken down into specific address fields later
  city: string;
  postalCode: string;
  notes: string; // This is a general customer note, not order-specific
}

export interface OrderData {
  items: CartItem[];
  totalPrice: number;
  customerInfo: CustomerInfo; // This will now be used to create/link a customer
  deliveryMethod: "shipping" | "pickup";
  promoApplied: boolean;
  shippingCost: number;
  notes: string; // This is now a note specific to the order
  paymentMethod: "mercadopago" | "transfer";
  // Add payment_intent_id here if it's available at the time of order creation
  // For 'transfer' orders, this might be null initially or set to a custom ID.
  paymentIntentId?: string | null;
  uniqueReference?: string;
}

// ---
// Server Action to create an order
// ---

export async function createOrder(orderData: OrderData) {
  try {
    const supabase = await createSupabaseServer();

    // --- Step 1: Handle Customer Information (Insert or find existing customer) ---
    let customerId: string; // Assuming customer IDs are UUIDs or BIGINT as strings

    // First, try to find the customer by email
    const { data: existingCustomer, error: customerFetchError } = await supabase
      .from("clients") // Assuming your customer table is named 'clientes'
      .select("id")
      .eq("email", orderData.customerInfo.email)
      .single();

    if (customerFetchError && customerFetchError.code !== "PGRST116") {
      // PGRST116 is "No rows found"
      console.error("Error fetching customer:", customerFetchError);
      return { success: false, error: "Error al buscar cliente." };
    }

    if (existingCustomer) {
      // Customer found, use their ID
      customerId = existingCustomer.id;
      console.log(`Cliente existente encontrado: ${customerId}`);
    } else {
      // Customer not found, create a new one
      console.log("Creando nuevo cliente...");
      const { data: newCustomer, error: customerInsertError } = await supabase
        .from("clients") // Assuming your customer table is named 'clientes'
        .insert({
          first_name: orderData.customerInfo.firstName,
          last_name: orderData.customerInfo.lastName,
          email: orderData.customerInfo.email,
          phone: orderData.customerInfo.phone,
          address: orderData.customerInfo.address, // Consider breaking this into more fields later
          city: orderData.customerInfo.city,
          postal_code: orderData.customerInfo.postalCode,
          notes: orderData.customerInfo.notes, // This is now a customer-specific note
          // Add other customer-specific fields as per your 'clientes' table schema
        })
        .select("id") // Select just the ID of the new customer
        .single();

      if (customerInsertError) {
        console.error("Error al insertar nuevo cliente:", customerInsertError);
        return { success: false, error: "Error al crear cliente." };
      }
      customerId = newCustomer.id;
      console.log(`Nuevo cliente creado: ${customerId}`);
    }

    // --- Step 2: Insert the main order into the 'ordenes' table ---
    // The 'customerInfo.notes' from the original OrderData should now map to 'notas_pedido' if it's order-specific
    // and 'customerInfo.notes' mapped to 'notas_cliente' for the customer table.
    const { data: order, error: orderError } = await supabase
      .from("orders") // Changed to 'ordenes' table
      .insert({
        client_id: customerId, // Link to the customer ID
        created_at: new Date().toISOString(), // Use current timestamp
        total_amount: orderData.totalPrice,
        delivery_method: orderData.deliveryMethod,
        shipping_cost: orderData.shippingCost,
        payment_method: orderData.paymentMethod,
        promo_applied: orderData.promoApplied,
        notes: orderData.notes, // Use orderData.notes for order-specific notes
        status: "pending", // Initial order status
        // If paymentIntentId is provided for Mercado Pago, include it here
        // Remove direct customer info from 'ordenes' if it's already in 'clientes'
        // Unless you explicitly want to denormalize it here for quick lookup (less recommended)
        // e.g., customer_email: orderData.customerInfo.email,
      })
      .select(); // Return the inserted order row

    if (orderError) {
      console.error("Error al insertar la orden:", orderError);
      return { success: false, error: orderError.message };
    }

    if (!order || order.length === 0) {
      console.error("No order data received after insertion.");
      return {
        success: false,
        error: "Failed to retrieve order ID after insertion.",
      };
    }

    const orderId = order[0].id; // Get the ID of the newly created order

    // --- Step 3: Insert the cart items into the 'items_orden' table ---
    const orderItemsToInsert = orderData.items.map((item) => ({
      order_id: orderId,
      // product_id: item.id, // Assuming 'id' from CartItem is your product's ID
      // If your 'products' table uses UUIDs, ensure item.id is a UUID string.
      // If it uses BIGINT, you might need to convert or ensure it's a number.
      product_id: item.id, // Ensure this matches the `id` type in your 'products' table
      name: item.name,
      quantity: item.quantity,
      price: item.price, // Save the price at the time of purchase
      // Add variant_details if you have them in CartItem and your DB table
      // variant_details: item.variantDetails || null,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items") // Changed to 'items_order' table
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error(
        "Error al insertar los items de la orden:",
        orderItemsError
      );
      // IMPORTANT: If item insertion fails, you might want to roll back the main order.
      // This would involve deleting the 'order' row you just created.
      // For simplicity, we're just returning an error for now.
      return { success: false, error: orderItemsError.message };
    }

    return { success: true, orderId: orderId };
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("General error in createOrder:", error);
    return { success: false, error: errorMessage };
  }
}
