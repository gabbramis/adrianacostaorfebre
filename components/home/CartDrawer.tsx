"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Truck,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    state,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    getShipping,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-stone-50">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center mr-3">
                <ShoppingBag className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-serif">Tu Carrito</h2>
                {getTotalItems() > 0 && (
                  <p className="text-sm text-gray-500">
                    {getTotalItems()} productos
                  </p>
                )}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="text-stone-400" size={40} />
            </div>
            <h3 className="text-xl font-serif mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Descubre nuestra hermosa colección de joyería artesanal y
              encuentra la pieza perfecta.
            </p>
            <Link href="/galeria" onClick={closeCart}>
              <Button className="bg-stone-800 hover:bg-stone-700 px-8">
                Explorar Productos
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence>
                <div className="space-y-4">
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-stone-50">
                          <img
                            src={item.imageSrc || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate mb-1">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.materials.slice(0, 2).map((material, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-xs"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                          <p className="text-lg font-semibold text-stone-800">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-stone-300"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-stone-300"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-800">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.price)} c/u
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            {/* Footer con resumen y botones */}
            <div className="border-t bg-stone-50 px-6 py-6 space-y-4">
              {/* Información de envío */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Truck size={16} className="mr-2" />
                  <span>Envío</span>
                </div>
                <span
                  className={
                    getShipping() === 0
                      ? "text-green-600 font-medium"
                      : "text-gray-900"
                  }
                >
                  {getShipping() === 0
                    ? "¡Gratis!"
                    : formatPrice(getShipping())}
                </span>
              </div>

              {getShipping() === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 text-center">
                    🎉 ¡Felicitaciones! Tienes envío gratis
                  </p>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Subtotal:</span>
                <span className="text-2xl font-bold text-stone-800">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Link href="/carrito" onClick={closeCart}>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-stone-300 hover:bg-stone-50"
                  >
                    <ShoppingBag className="mr-2" size={18} />
                    Ver Carrito Completo
                  </Button>
                </Link>
                <Link href="/carrito" onClick={closeCart}>
                  <Button className="w-full h-12 bg-stone-800 hover:bg-stone-700 text-white">
                    <CreditCard className="mr-2" size={18} />
                    Proceder al Pago
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Impuestos y envío final calculados en el checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
