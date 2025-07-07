// pages/api/mercadopago/payment-success.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServer } from "@/utils/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { payment_id, external_reference: orderIdFromMP } = req.query;

    console.log(
      "Mercado Pago Redirection (Success) - Query Params:",
      req.query
    );

    if (!payment_id) {
      console.error(
        "No payment_id received from Mercado Pago. Redireccionando a fallo."
      );
      return res.redirect(302, `/pago-fallido?error=no_payment_id`);
    }

    try {
      const supabase = await createSupabaseServer();

      let orderId = String(orderIdFromMP || "");
      let order;

      // Intenta buscar la orden primero por external_reference (orderId)
      if (orderId) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();
        order = data;
        if (error || !order) {
          console.warn(
            `Orden ${orderId} no encontrada directamente. Intentando por payment_id_mp.`
          );
          // Si no se encontró por ID de orden, intenta por payment_id_mp
          const { data: dataByMpId, error: errorByMpId } = await supabase
            .from("orders")
            .select("*")
            .eq("payment_id_mp", String(payment_id))
            .single();
          order = dataByMpId;
          if (errorByMpId || !order) {
            console.error(
              `Error al buscar la orden (por ID o payment_id_mp) para el payment_id ${payment_id}:`,
              error || errorByMpId
            );
            return res.redirect(
              302,
              `/pago-fallido?error=order_not_found_or_not_linked&paymentId=${payment_id}`
            );
          }
          orderId = order.id; // Actualiza orderId si se encontró por payment_id_mp
        }
      } else {
        // Si no hay external_reference, obligatoriamente busca por payment_id_mp
        const { data: dataByMpId, error: errorByMpId } = await supabase
          .from("orders")
          .select("*")
          .eq("payment_id_mp", String(payment_id))
          .single();
        order = dataByMpId;
        if (errorByMpId || !order) {
          console.error(
            `Error al buscar la orden (solo por payment_id_mp) para el payment_id ${payment_id}:`,
            errorByMpId
          );
          return res.redirect(
            302,
            `/pago-fallido?error=order_not_found_by_payment_id&paymentId=${payment_id}`
          );
        }
        orderId = order.id; // Asigna orderId
      }

      // NO CONSULTAR A MERCADO PAGO AQUÍ. NO ACTUALIZAR EL ESTADO AQUÍ.
      // El webhook es el responsable de la actualización.
      // Solo redirige basándote en el estado actual de la orden en tu DB.

      // Puedes agregar una pequeña espera si sospechas de una race condition muy ajustada,
      // aunque el webhook debería ser casi instantáneo.
      // await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms

      // Re-fetch de la orden para asegurar el estado más reciente después de la posible espera
      const { data: updatedOrder, error: updatedOrderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (updatedOrderError || !updatedOrder) {
        console.error(
          `Error al re-buscar la orden ${orderId} después de la redirección:`,
          updatedOrderError
        );
        return res.redirect(
          302,
          `/pago-fallido?error=order_state_unavailable&orderId=${orderId}`
        );
      }

      const redirectData = {
        orderId: String(orderId || ""),
        deliveryMethod: String(updatedOrder.deliveryMethod || "unknown"),
        paymentMethod: "mercadopago",
        confirmedOrderTotal: String(updatedOrder.totalPrice || "0"), // Usa el totalPrice de la orden
      };

      const frontendRedirectParams = new URLSearchParams(
        redirectData
      ).toString();

      // Si la orden existe y tiene un estado de pago, redirige a confirmación.
      // Si el estado no es "pagado" (o el que uses para aprobado), podrías redirigir a fallo.
      if (updatedOrder.status === "pagado") {
        // Asegúrate de que este estado coincide con el del webhook
        return res.redirect(
          302,
          `/confirmacion-pedido?${frontendRedirectParams}`
        );
      } else {
        // Si el webhook aún no ha actualizado o el pago no fue aprobado
        return res.redirect(
          302,
          `/pago-fallido?status=${updatedOrder.status}&orderId=${orderId}`
        );
      }
    } catch (error) {
      console.error(
        "Error general al procesar la redirección de Mercado Pago:",
        error
      );
      return res.redirect(
        302,
        `/pago-fallido?error=redirection_processing_failed`
      );
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
