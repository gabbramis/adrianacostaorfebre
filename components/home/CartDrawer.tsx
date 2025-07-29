"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
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
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0 overflow-hidden dark:bg-zinc-900 dark:text-white">
        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-stone-50 to-stone-100 dark:from-zinc-800 dark:to-zinc-700 dark:border-zinc-700 flex-shrink-0">
          <SheetTitle className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-stone-800 to-stone-700 dark:from-white dark:to-zinc-300 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-sm">
              <ShoppingBag
                className="text-white dark:text-zinc-900"
                size={16}
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif text-stone-800 dark:text-white">
                Tu Carrito
              </h2>
              {getTotalItems() > 0 && (
                <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300">
                  {getTotalItems()}{" "}
                  {getTotalItems() === 1 ? "producto" : "productos"}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
              <ShoppingCart
                className="text-stone-400 dark:text-zinc-400"
                size={32}
              />
            </div>
            <h3 className="text-lg sm:text-xl font-serif mb-2 text-stone-800 dark:text-white">
              Tu carrito está vacío
            </h3>
            <p className="text-stone-600 dark:text-zinc-300 mb-6 sm:mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
              Descubre nuestra hermosa colección de joyería artesanal y
              encuentra la pieza perfecta para ti.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 dark:from-white dark:to-zinc-200 dark:text-black px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              <Link href="/galeria" onClick={closeCart}>
                Explorar Productos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 min-h-0">
              <AnimatePresence>
                <div className="space-y-3 sm:space-y-4">
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-zinc-800 rounded-2xl p-3 sm:p-4 shadow-sm border border-stone-100 dark:border-zinc-700 hover:shadow-lg hover:border-stone-200 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 dark:from-zinc-700 dark:to-zinc-600 shadow-inner">
                          <img
                            src={item.imageSrc || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-stone-900 dark:text-white truncate mb-1 text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.materials.slice(0, 2).map((material, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-gradient-to-r from-stone-100 to-stone-200 dark:from-zinc-600 dark:to-zinc-500 text-stone-700 dark:text-white px-2 py-0.5 rounded-full text-xs font-medium"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-stone-800 dark:text-white">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-full h-8 w-8 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-3 sm:mt-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-stone-50 dark:bg-zinc-700 rounded-full p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-600 transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center font-medium text-stone-800 dark:text-white text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-600 transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-800 dark:text-white text-sm sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-stone-500 dark:text-zinc-400">
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

            {/* Footer con resumen y botón */}
            <div className="border-t bg-gradient-to-r from-stone-50 to-stone-100 dark:from-zinc-800 dark:to-zinc-700 px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 flex-shrink-0">
              {/* Resumen rápido */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-600 dark:text-zinc-300 text-sm sm:text-base">
                    Subtotal
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-stone-800 dark:text-white">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
                  <span>
                    {getTotalItems()}{" "}
                    {getTotalItems() === 1 ? "producto" : "productos"}
                  </span>
                  <span>Envío e impuestos al finalizar</span>
                </div>
              </div>

              {/* Botón de acción principal */}
              <Button
                asChild
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 dark:from-white dark:to-zinc-200 dark:text-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group text-sm sm:text-base"
              >
                <Link href="/carrito" onClick={closeCart}>
                  <span className="flex items-center justify-center">
                    Ver Carrito Completo
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                      size={18}
                    />
                  </span>
                </Link>
              </Button>

              {/* Botón secundario */}
              <Button
                variant="outline"
                className="w-full h-9 sm:h-10 border-stone-300 dark:border-zinc-500 hover:bg-stone-50 dark:hover:bg-zinc-700 text-stone-700 dark:text-white rounded-xl transition-all duration-200 text-sm sm:text-base"
                onClick={closeCart}
              >
                Seguir Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
