import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createSupabaseServer } from "@/utils/supabase/server"; // Asegurate que esta ruta sea correcta

// Configura tus credenciales de Mercado Pago. ¡USA TU ACCESS TOKEN DE PRODUCCIÓN Y ENTORNO!
const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { payment_id } = req.query;

    console.log(
      "Mercado Pago Redirection (Success) - Query Params:",
      req.query
    );

    // --- 1. VERIFICACIÓN CRÍTICA: Consulta el estado real del pago con la API de Mercado Pago ---
    // No confíes solo en los parámetros de la URL que Mercado Pago envía directamente.
    if (!payment_id) {
      console.error(
        "No payment_id received from Mercado Pago. Redireccionando a fallo."
      );
      return res.redirect(302, `/pago-fallido?error=no_payment_id`); // Redirige a tu página de fallo
    }

    try {
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: String(payment_id) });

      const finalPaymentStatus = paymentDetails.status;
      const orderId = paymentDetails.external_reference; // Tu ID de orden que pasaste al crear la preferencia
      const transactionAmount = paymentDetails.transaction_amount;

      if (finalPaymentStatus === "approved") {
        // --- 2. ACTUALIZA EL ESTADO DE TU ORDEN EN SUPABASE (VITAL) ---
        const supabase = await createSupabaseServer();

        // Obtén los datos completos de la orden desde tu base de datos
        // (Esto es necesario para obtener 'deliveryMethod' y verificar 'totalPrice')
        const { data: order, error: fetchOrderError } = await supabase
          .from("orders") // Asegurate que 'orders' es el nombre de tu tabla
          .select("*")
          .eq("id", orderId)
          .single();

        if (fetchOrderError || !order) {
          console.error(
            `Error al buscar la orden ${orderId} en Supabase o no encontrada:`,
            fetchOrderError
          );
          // Si la orden no se encuentra o hay un error, redirige a una página de error específica
          return res.redirect(
            302,
            `/pago-fallido?error=order_not_found&orderId=${orderId}`
          );
        }

        // Opcional pero muy recomendado: Verificar que el monto pagado coincida con el esperado
        if (order.totalPrice !== transactionAmount) {
          console.warn(
            `Alerta de fraude/discrepancia: Monto pagado (${transactionAmount}) NO coincide con el esperado (${order.totalPrice}) para el pedido ${orderId}.`
          );
          // Aquí podrías decidir qué hacer:
          // 1. Marcar el pedido para revisión manual.
          // 2. Si es una diferencia menor aceptable, seguir.
          // Por ahora, simplemente lo logueamos como advertencia.
        }

        // Actualiza el estado de la orden a 'pagado' o 'completado'
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "paid", // Cambia el estado de la orden a 'pagado'
            payment_id_mp: String(payment_id), // Guarda el ID de pago de MP para futuras referencias
            // Puedes agregar otros campos relevantes del pago aquí si tu tabla los tiene (ej. payment_method_detail, payer_id_mp)
          })
          .eq("id", orderId);

        if (updateError) {
          console.error(
            `Error al actualizar el estado de la orden ${orderId} a 'paid':`,
            updateError
          );
          // A pesar del error en la actualización, como el pago fue aprobado,
          // se podría redirigir a la página de éxito, pero deberías tener un sistema de alerta.
          // Para robustez, podrías redirigir a un error si la actualización de la DB falla.
        }
        const redirectData = {
          orderId: String(orderId || ""), // Asegura que sea string, incluso si es undefined
          deliveryMethod: String(order.deliveryMethod || "unknown"), // Convierte a string y provee un fallback
          paymentMethod: "mercadopago", // Ya es un string literal
          confirmedOrderTotal: String(transactionAmount), // Convierte el número a string
          // Puedes añadir otros datos si los necesitas y están disponibles
        };

        // --- 3. REDIRIGE AL FRONTEND con los datos CONFIRMADOS y LIMPIOS ---
        // Codifica los datos obtenidos y verificados para pasarlos por la URL al frontend.
        const frontendRedirectParams = new URLSearchParams(
          redirectData
        ).toString();

        // Redirige al navegador del usuario a tu página de confirmación en el frontend
        return res.redirect(
          302,
          `/confirmacion-pedido?${frontendRedirectParams}`
        );
      } else {
        // El pago NO fue aprobado (puede ser 'pending', 'rejected', 'cancelled', etc.)
        console.log(
          `Pago ${payment_id} no aprobado. Estado final: ${finalPaymentStatus}`
        );
        return res.redirect(302, `/pago-fallido?status=${finalPaymentStatus}`); // Redirige a tu página de fallo
      }
    } catch (error) {
      console.error(
        "Error general al consultar o procesar el pago de Mercado Pago:",
        error
      );
      return res.redirect(302, `/pago-fallido?error=payment_processing_failed`); // Error interno del servidor
    }
  } else {
    // Si no es un método GET, devuelve un error 405
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
