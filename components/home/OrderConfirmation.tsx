import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Box, Truck, CreditCard, Banknote } from "lucide-react"; // Assuming lucide-react for icons
import Link from "next/link"; // Assuming Next.js Link component
import { Button } from "@/components/ui/button"; // Assuming your Button component path

interface OrderConfirmationProps {
  orderId: string | null;
  deliveryMethod: "pickup" | "shipping";
  paymentMethod: "mercadopago" | "transfer";
  confirmedOrderTotal: number;
  formatPrice: (price: number) => string;
  department?: string;
}

const OrderConfirmation = ({
  orderId,
  deliveryMethod,
  paymentMethod,
  confirmedOrderTotal,
  formatPrice,
  department,
}: OrderConfirmationProps) => {
  return (
    <>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 text-gray-800 font-sans">
        <div className="container mx-auto px-4 py-16 sm:py-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100"
          >
            {/* Ícono de confirmación */}
            <div className="w-20 h-20 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-white transform transition-transform duration-300 hover:scale-105">
              <CheckCircle2
                className="text-white"
                size={40}
                strokeWidth={1.8}
              />
            </div>

            {/* Título y número de pedido */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800 leading-tight">
              ¡Pedido Confirmado!
            </h1>
            {orderId && (
              <p className="text-md text-gray-600 mb-5 font-light">
                Tu número de pedido es:{" "}
                <span className="font-semibold text-indigo-700 select-all tracking-wide">
                  #{orderId}
                </span>
              </p>
            )}

            {/* Mensaje de agradecimiento */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Gracias por tu confianza. Te contactaremos muy pronto para
              coordinar{" "}
              {deliveryMethod === "pickup" ? (
                <span className="font-medium text-indigo-600 flex items-center justify-center gap-2">
                  <Box size={18} /> el retiro en taller
                </span>
              ) : (
                <span className="font-medium text-indigo-600 flex items-center justify-center gap-2">
                  <Truck size={18} /> la entrega a domicilio
                </span>
              )}
              .
            </p>

            {/* Resumen del pedido */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-xs mb-8 border border-gray-100">
              <h2 className="text-xl font-semibold mb-5 text-gray-700">
                Resumen de tu pedido
              </h2>
              <div className="space-y-3 text-left text-base">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Total pagado:</span>
                  <span className="font-bold text-3xl text-indigo-700">
                    {formatPrice(confirmedOrderTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Método de entrega:</span>
                  <span className="font-medium text-gray-700">
                    {deliveryMethod === "pickup"
                      ? "Retiro en taller"
                      : department === "Montevideo"
                        ? "Envío a domicilio"
                        : "Envío por DAC (A cobrar en destino)"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-medium text-gray-700 flex items-center">
                    {paymentMethod === "mercadopago" ? (
                      <>
                        <CreditCard
                          className="inline-block mr-2 text-blue-500"
                          size={18}
                        />{" "}
                        Mercado Pago
                      </>
                    ) : (
                      <>
                        <Banknote
                          className="inline-block mr-2 text-green-500"
                          size={18}
                        />{" "}
                        Transferencia bancaria
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Información de la cuenta bancaria SOLO si es transferencia */}
              {paymentMethod === "transfer" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  className="mt-7 pt-6 border-t border-gray-200 text-left bg-white p-6 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                    <Banknote
                      className="inline-block mr-3 text-green-600"
                      size={22}
                    />
                    Datos para Transferencia Bancaria
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    Por favor, realiza la transferencia por el monto total a
                    nombre de **Adriana** en una de las siguientes cuentas:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                      <h4 className="font-semibold text-md mb-2 text-gray-800">
                        Scotiabank
                      </h4>
                      <p className="text-sm">
                        <span className="font-medium">Tipo de cuenta:</span>{" "}
                        Caja de Ahorro
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Número de cuenta:</span>{" "}
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono text-gray-900 select-all">
                          863384300
                        </code>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Moneda:</span> UYU
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                      <h4 className="font-semibold text-md mb-2 text-gray-800">
                        BROU
                      </h4>
                      <p className="text-sm">
                        <span className="font-medium">
                          Número de cuenta actual:
                        </span>{" "}
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono text-gray-900 select-all">
                          110766226-00001
                        </code>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">
                          Número de cuenta anterior:
                        </span>{" "}
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono text-gray-900 select-all">
                          601-0163707
                        </code>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">
                          Para transferencia desde otros bancos:
                        </span>{" "}
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono text-gray-900 select-all">
                          11076622600001
                        </code>
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-xs text-gray-500 italic">
                    Recuerda enviar el comprobante de transferencia para que
                    podamos procesar tu pedido sin demoras.
                  </p>
                  {/* --- NUEVO: Botón de WhatsApp --- */}
                  <div className="mt-6">
                    <a
                      href={`https://wa.me/59899123456?text=${encodeURIComponent(
                        `¡Hola! Acabo de realizar una transferencia bancaria por el pedido #${orderId}. Aquí adjunto el comprobante.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 group"
                    >
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      Enviar WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/galeria" passHref>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 transition-colors duration-200"
                >
                  Seguir Comprando
                </Button>
              </Link>
              <Link href="/contacto" passHref>
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 text-lg shadow-md transition-colors duration-200">
                  Contactar Soporte
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default OrderConfirmation;
