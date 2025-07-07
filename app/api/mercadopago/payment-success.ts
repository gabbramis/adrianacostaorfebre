import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server";

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { payment_id } = req.query;

    console.log("🔄 Redirect Success - Query Params:", req.query);

    if (!payment_id) {
      console.error("No payment_id received from Mercado Pago.");
      return res.redirect(302, `/pago-fallido?error=no_payment_id`);
    }

    try {
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: String(payment_id) });

      const finalPaymentStatus = paymentDetails.status;
      const orderId = paymentDetails.external_reference;
      const transactionAmount = paymentDetails.transaction_amount;

      console.log("💳 Payment details on redirect:", {
        id: payment_id,
        status: finalPaymentStatus,
        orderId: orderId,
        amount: transactionAmount,
      });

      if (finalPaymentStatus === "approved") {
        const supabase = await createSupabaseServer();

        // 🔥 ESPERAR UN POCO PARA QUE EL WEBHOOK PROCESE PRIMERO
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Buscar la orden
        const { data: order, error: fetchOrderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (fetchOrderError || !order) {
          console.error(
            `❌ Error al buscar la orden ${orderId}:`,
            fetchOrderError
          );
          return res.redirect(
            302,
            `/pago-fallido?error=order_not_found&orderId=${orderId}`
          );
        }

        // Verificar monto
        if (order.totalPrice !== transactionAmount) {
          console.warn(
            `⚠️  Monto discrepante: esperado ${order.totalPrice}, pagado ${transactionAmount}`
          );
        }

        // 🔥 SOLO ACTUALIZAR SI EL WEBHOOK NO LO HIZO
        if (order.status !== "pagado" || !order.payment_id_mp) {
          console.log(
            "🔧 Webhook no actualizó la orden, actualizando via redirect..."
          );

          const { error: updateError } = await supabase
            .from("orders")
            .update({
              status: "pagado",
              payment_id_mp: String(payment_id),
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
            .eq("status", "pending_payment"); // Solo actualizar si está pendiente

          if (updateError) {
            console.error(
              `❌ Error al actualizar orden ${orderId}:`,
              updateError
            );
            // Continuar con el redirect aunque falle la actualización
          } else {
            console.log("✅ Orden actualizada via redirect como fallback");
          }
        } else {
          console.log("✅ Orden ya actualizada por webhook");
        }

        // 🔥 OBTENER DATOS ACTUALIZADOS DE LA ORDEN
        const { data: finalOrder, error: finalFetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (finalFetchError || !finalOrder) {
          console.error(
            `❌ Error al obtener orden final ${orderId}:`,
            finalFetchError
          );
          return res.redirect(
            302,
            `/pago-fallido?error=final_order_fetch_failed&orderId=${orderId}`
          );
        }

        // Preparar datos para el redirect
        const redirectData = {
          orderId: String(orderId || ""),
          deliveryMethod: String(finalOrder.deliveryMethod || "unknown"),
          paymentMethod: "mercadopago",
          confirmedOrderTotal: String(transactionAmount),
          paymentId: String(payment_id),
        };

        const frontendRedirectParams = new URLSearchParams(
          redirectData
        ).toString();
        return res.redirect(
          302,
          `/confirmacion-pedido?${frontendRedirectParams}`
        );
      } else if (finalPaymentStatus === "pending") {
        console.log(
          `⏳ Pago ${payment_id} pendiente. Estado: ${finalPaymentStatus}`
        );
        return res.redirect(
          302,
          `/pago-pendiente?payment_id=${payment_id}&status=${finalPaymentStatus}`
        );
      } else {
        console.log(
          `❌ Pago ${payment_id} no aprobado. Estado: ${finalPaymentStatus}`
        );
        return res.redirect(
          302,
          `/pago-fallido?status=${finalPaymentStatus}&payment_id=${payment_id}`
        );
      }
    } catch (error) {
      console.error("❌ Error al procesar redirect:", error);
      return res.redirect(302, `/pago-fallido?error=payment_processing_failed`);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
