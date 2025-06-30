"use client";

import { useState } from "react";
import { mercadopagoPayment } from "@/app/actions/mercadopago-payment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Gift,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const {
    state,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getShipping,
    getFinalTotal,
  } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "bienvenido") {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const formData = new FormData();
    formData.append("productName", "Checkout");
    formData.append("productPrice", getTotalPrice().toString());
    formData.append("productQuantity", "1");
    const url = await mercadopagoPayment(formData);
    if (url) {
      window.location.href = url;
    }
  };

  if (state.items.length === 0) {
    return (
      <>
        <main className="pt-16 min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-lg mx-auto"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <ShoppingBag className="text-stone-400" size={60} />
              </div>
              <h1 className="text-3xl font-serif mb-4 text-stone-800">
                Tu carrito está vacío
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Descubre nuestra hermosa colección de joyería artesanal y
                encuentra la pieza perfecta para ti.
              </p>
              <Link href="/galeria">
                <Button className="bg-stone-800 hover:bg-stone-700 px-8 py-6 text-lg">
                  <ShoppingBag className="mr-2" size={20} />
                  Explorar Productos
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="pt-0 md:pt-16 min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="container mx-auto px-4 py-4">
          {/* Header mejorado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="block md:flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex  items-center">
              <Link href="/galeria" className="mr-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-3xl font-serif text-stone-800">
                  Carrito de Compras
                </h1>
                <p className="text-gray-600">
                  Revisa tus productos antes de continuar
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Lista de productos mejorada */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex items-center text-lg md:text-xl gap-2">
                      <ShoppingBag className="text-stone-600" size={20} />
                      <span className="sm:inline">Productos en tu carrito</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6">
                    <AnimatePresence>
                      <div className="space-y-3 md:space-y-6">
                        {state.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-gradient-to-r from-white to-stone-50 rounded-xl md:rounded-2xl p-3 md:p-6 border border-stone-200 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 md:gap-6">
                              {/* Product Image */}
                              <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-stone-100">
                                <img
                                  src={item.imageSrc || "/placeholder.svg"}
                                  alt={item.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-xl font-medium text-gray-900 mb-1 md:mb-2 line-clamp-2">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                                  {item.materials.map((material, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs bg-stone-100 px-2 py-0.5"
                                    >
                                      {material}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 capitalize hidden md:block">
                                  Categoría: {item.category}
                                </p>
                              </div>

                              {/* Mobile: Price and Actions Horizontally Aligned */}
                              <div className="flex items-center gap-3 md:hidden">
                                {/* Quantity Controls */}
                                <div className="flex items-center bg-stone-100 rounded-full p-0.5">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-white"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-semibold text-sm">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-white"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>

                                {/* Pricing */}
                                <div className="text-right">
                                  <p className="text-lg font-bold text-stone-800">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatPrice(item.price)} c/u
                                  </p>
                                </div>
                              </div>

                              {/* Desktop: Quantity Controls */}
                              <div className="hidden md:flex flex-col items-center gap-2">
                                <div className="flex items-center bg-stone-100 rounded-full p-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full hover:bg-white"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    <Minus size={16} />
                                  </Button>
                                  <span className="w-12 text-center font-semibold text-lg">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full hover:bg-white"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus size={16} />
                                  </Button>
                                </div>
                              </div>

                              {/* Desktop: Price */}
                              <div className="hidden md:block text-right">
                                <p className="text-2xl font-bold text-stone-800">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatPrice(item.price)} c/u
                                </p>
                              </div>

                              {/* Desktop: Delete Button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar de resumen mejorado */}
            <div className="space-y-6">
              {/* Código promocional mejorado */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <Tag className="mr-2 text-stone-600" size={20} />
                      Código Promocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {promoApplied ? (
                      <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                        <CheckCircle2
                          className="text-green-600 mr-2"
                          size={20}
                        />
                        <span className="text-green-700 font-medium">
                          ¡Código aplicado!
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Ingresa tu código"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="border-stone-300"
                        />
                        <Button
                          variant="outline"
                          onClick={handlePromoCode}
                          className="px-6"
                        >
                          Aplicar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resumen mejorado */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-stone-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">
                      Resumen del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Truck size={18} className="mr-2 text-stone-600" />
                        Envío
                      </span>
                      <span
                        className={
                          getShipping() === 0
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {getShipping() === 0
                          ? "¡Gratis!"
                          : formatPrice(getShipping())}
                      </span>
                    </div>

                    {getShipping() === 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                        <p className="text-sm text-green-700 text-center">
                          🎉 Envío gratis en compras superiores a $2000
                        </p>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="text-stone-800">
                        {formatPrice(getFinalTotal())}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-stone-800 hover:bg-stone-700 py-6 text-lg font-medium"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2" size={20} />
                          Proceder al Pago
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-gray-500 text-center space-y-1">
                      <p>Métodos de pago aceptados:</p>
                      <p className="font-medium">
                        Transferencia • Mercado Pago • Efectivo
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Información adicional mejorada */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                          <Truck className="text-stone-600" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            Envío seguro
                          </p>
                          <p className="text-sm text-gray-600">
                            Empaque especial para joyería
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                          <Shield className="text-stone-600" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            Compra protegida
                          </p>
                          <p className="text-sm text-gray-600">
                            Garantía de 6 meses
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                          <Gift className="text-stone-600" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            Empaque regalo
                          </p>
                          <p className="text-sm text-gray-600">
                            Sin costo adicional
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
