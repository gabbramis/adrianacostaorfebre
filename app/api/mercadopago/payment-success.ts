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

        // 🔥 SOLO VERIFICAR - NO ACTUALIZAR
        // El webhook ya debería haber actualizado la orden
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

        // Verificar monto (opcional pero recomendado)
        if (order.totalPrice !== transactionAmount) {
          console.warn(
            `⚠️  Monto discrepante: esperado ${order.totalPrice}, pagado ${transactionAmount}`
          );
        }

        // 🔥 ACTUALIZAR SOLO SI EL WEBHOOK NO LO HIZO
        // Esto es una medida de seguridad por si el webhook falla
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
            .eq("id", orderId);

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

        // Preparar datos para el redirect
        const redirectData = {
          orderId: String(orderId || ""),
          deliveryMethod: String(order.deliveryMethod || "unknown"),
          paymentMethod: "mercadopago",
          confirmedOrderTotal: String(transactionAmount),
        };

        const frontendRedirectParams = new URLSearchParams(
          redirectData
        ).toString();
        return res.redirect(
          302,
          `/confirmacion-pedido?${frontendRedirectParams}`
        );
      } else {
        console.log(
          `❌ Pago ${payment_id} no aprobado. Estado: ${finalPaymentStatus}`
        );
        return res.redirect(302, `/pago-fallido?status=${finalPaymentStatus}`);
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
