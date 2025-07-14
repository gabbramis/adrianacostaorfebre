"use client";
import { mercadopagoPayment } from "@/app/actions/mercadopago-payment";
import { createOrder, OrderData } from "@/app/actions/transfer-orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  CheckCircle2,
  Package,
  Banknote,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import OrderConfirmation from "./OrderConfirmation";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export default function CartPage() {
  const { state, getTotalPrice, getShipping, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "mercadopago" | "transfer"
  >("mercadopago");
  const [orderId, setOrderId] = useState<string | null>(null);
  console.log(orderId);

  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(0);

  const [isValidating, setIsValidating] = useState(false);
  console.log(isValidating);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">(
    "shipping"
  );

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  useEffect(() => {
    if (
      orderComplete &&
      paymentMethod === "transfer" &&
      state.items.length > 0
    ) {
      clearCart();
    }
  }, [orderComplete, paymentMethod, clearCart, state.items.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateShipping = () => {
    return deliveryMethod === "pickup" ? 0 : getShipping();
  };

  const calculateTotal = () => {
    return getTotalPrice() + calculateShipping();
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const currentCalculatedTotal = calculateTotal();

    const orderData: OrderData = {
      items: state.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: currentCalculatedTotal,
      customerInfo: customerInfo,
      deliveryMethod: deliveryMethod,
      promoApplied: false,
      shippingCost: calculateShipping(),
      notes: customerInfo.notes,
      paymentMethod: paymentMethod,
    };

    try {
      if (paymentMethod === "mercadopago") {
        const formData = new FormData();
        formData.append("products", JSON.stringify(orderData.items));
        formData.append("totalPrice", orderData.totalPrice.toString());
        formData.append("customerInfo", JSON.stringify(orderData.customerInfo));
        formData.append("deliveryMethod", orderData.deliveryMethod);
        formData.append("promoApplied", "false");
        formData.append("shippingCost", orderData.shippingCost.toString());
        formData.append("notes", orderData.notes);

        try {
          const result = await mercadopagoPayment(orderData);

          if (result && result.success && result.url) {
            window.location.href = result.url;
          } else {
            alert(
              `No se pudo generar el link de pago con Mercado Pago: ${
                result?.error || "Error desconocido"
              }`
            );
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("Error calling mercadopagoPayment:", error);
          alert("Ocurrió un error inesperado al procesar el pago.");
          setIsProcessing(false);
        }
      } else if (paymentMethod === "transfer") {
        const {
          success,
          orderId: newOrderId,
          error,
        } = await createOrder(orderData);

        if (!success) {
          console.error("Error al guardar la orden en Supabase:", error);
          alert("Hubo un error al procesar tu pedido. Intenta de nuevo.");
          setIsProcessing(false);
          return;
        }

        setOrderId(newOrderId);
        setConfirmedOrderTotal(currentCalculatedTotal);
        setOrderComplete(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error inesperado durante el checkout:", error);
      alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!(customerInfo.firstName || "").trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!(customerInfo.lastName || "").trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }

    if (!(customerInfo.email || "").trim()) {
      newErrors.email = "El email es obligatorio";
    }

    if (!(customerInfo.phone || "").trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }

    if (deliveryMethod === "shipping") {
      if (!(customerInfo.address || "").trim()) {
        newErrors.address = "La dirección es obligatoria";
      }

      if (!(customerInfo.city || "").trim()) {
        newErrors.city = "La ciudad es obligatoria";
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [customerInfo, deliveryMethod]);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setIsValidating(true);
      const validation = validateForm();
      if (validation.isValid) {
        setErrors({});
        setCurrentStep(2);
      } else {
        setErrors(validation.errors);
      }
      setIsValidating(false);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  if (state.items.length === 0 && !orderComplete) {
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

  if (orderComplete) {
    return (
      <OrderConfirmation
        orderId={orderId}
        deliveryMethod={deliveryMethod}
        paymentMethod={paymentMethod}
        confirmedOrderTotal={confirmedOrderTotal}
        formatPrice={formatPrice}
      />
    );
  }

  return (
    <>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header con progreso */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Link href="/galeria" className="mr-4">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft size={20} />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif text-stone-800">
                    Finalizar Compra
                  </h1>
                  <p className="text-gray-600">
                    Completa tu pedido en {3 - currentStep + 1} pasos
                  </p>
                </div>
              </div>
            </div>

            {/* Indicador de progreso */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step <= currentStep
                        ? "bg-stone-800 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-colors ${
                        step < currentStep ? "bg-stone-800" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              {currentStep === 1 && "Información personal"}
              {currentStep === 2 && "Entrega y pago"}
              {currentStep === 3 && "Confirmación"}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Paso 1: Información del cliente */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <User className="mr-2 text-stone-600" size={24} />
                          Información Personal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre *</Label>
                            <Input
                              id="firstName"
                              value={customerInfo.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              className={
                                errors.firstName ? "border-red-500" : ""
                              }
                              placeholder="Tu nombre"
                            />
                            {errors.firstName && (
                              <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido *</Label>
                            <Input
                              id="lastName"
                              value={customerInfo.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              className={
                                errors.lastName ? "border-red-500" : ""
                              }
                              placeholder="Tu apellido"
                            />
                            {errors.lastName && (
                              <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id="email"
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className={`pl-10 ${
                                errors.email ? "border-red-500" : ""
                              }`}
                              placeholder="tu@email.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono *</Label>
                          <div className="relative">
                            <Phone
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id="phone"
                              value={customerInfo.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className={`pl-10 ${
                                errors.phone ? "border-red-500" : ""
                              }`}
                              placeholder="+598 99 123 456"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">
                            Dirección {deliveryMethod === "shipping" && "*"}
                          </Label>
                          <div className="relative">
                            <Home
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id="address"
                              value={customerInfo.address}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              className={`pl-10 ${
                                errors.address ? "border-red-500" : ""
                              }`}
                              placeholder="Calle, número, apartamento"
                            />
                          </div>
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">
                              Ciudad {deliveryMethod === "shipping" && "*"}
                            </Label>
                            <Input
                              id="city"
                              value={customerInfo.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              className={errors.city ? "border-red-500" : ""}
                              placeholder="Montevideo"
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.city}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Código Postal</Label>
                            <Input
                              id="postalCode"
                              value={customerInfo.postalCode}
                              onChange={(e) =>
                                handleInputChange("postalCode", e.target.value)
                              }
                              placeholder="11000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">
                            Notas adicionales (opcional)
                          </Label>
                          <Textarea
                            id="notes"
                            value={customerInfo.notes}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            placeholder="Instrucciones especiales, referencias de ubicación, etc."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Paso 2: Entrega y pago */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Método de entrega */}
                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <Truck className="mr-2 text-stone-600" size={24} />
                          Método de Entrega
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={deliveryMethod}
                          onValueChange={(value: "shipping" | "pickup") =>
                            setDeliveryMethod(value)
                          }
                        >
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-stone-50 transition-colors">
                              <RadioGroupItem value="shipping" id="shipping" />
                              <div className="flex-1">
                                <Label
                                  htmlFor="shipping"
                                  className="flex items-center cursor-pointer"
                                >
                                  <Truck
                                    className="mr-2 text-stone-600"
                                    size={20}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      Envío a domicilio
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Recibe tu pedido en la comodidad de tu
                                      hogar
                                    </p>
                                  </div>
                                </Label>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {getShipping() === 0
                                    ? "Gratis"
                                    : formatPrice(getShipping())}
                                </p>
                                <p className="text-xs text-gray-500">
                                  3-5 días hábiles
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-stone-50 transition-colors">
                              <RadioGroupItem value="pickup" id="pickup" />
                              <div className="flex-1">
                                <Label
                                  htmlFor="pickup"
                                  className="flex items-center cursor-pointer"
                                >
                                  <MapPin
                                    className="mr-2 text-stone-600"
                                    size={20}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      Retiro en taller
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Montevideo, Pocitos - Coordinaremos
                                      horario
                                    </p>
                                  </div>
                                </Label>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">
                                  Gratis
                                </p>
                                <p className="text-xs text-gray-500">
                                  Disponible hoy
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Método de pago */}
                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <CreditCard
                            className="mr-2 text-stone-600"
                            size={24}
                          />
                          Método de Pago
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={(value: "mercadopago" | "transfer") =>
                            setPaymentMethod(value)
                          }
                        >
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-stone-50 transition-colors">
                              <RadioGroupItem
                                value="mercadopago"
                                id="mercadopago"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor="mercadopago"
                                  className="flex items-center cursor-pointer"
                                >
                                  <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                    <CreditCard
                                      className="text-white"
                                      size={16}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">Mercado Pago</p>
                                    <p className="text-sm text-gray-600">
                                      Tarjeta de crédito, débito o dinero en
                                      cuenta
                                    </p>
                                  </div>
                                </Label>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                Recomendado
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-stone-50 transition-colors">
                              <RadioGroupItem value="transfer" id="transfer" />
                              <div className="flex-1">
                                <Label
                                  htmlFor="transfer"
                                  className="flex items-center cursor-pointer"
                                >
                                  <div className="w-8 h-8 bg-stone-600 rounded mr-3 flex items-center justify-center">
                                    <Banknote
                                      className="text-white"
                                      size={16}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      Transferencia Bancaria
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Te enviaremos los datos bancarios por
                                      email
                                    </p>
                                  </div>
                                </Label>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  1-2 días para procesar
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Paso 3: Confirmación */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <CheckCircle2
                            className="mr-2 text-stone-600"
                            size={24}
                          />
                          Confirmar Pedido
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Resumen de información */}
                        <div className="bg-stone-50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">
                            Información de contacto
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Nombre:</strong> {customerInfo.firstName}{" "}
                              {customerInfo.lastName}
                            </p>
                            <p>
                              <strong>Email:</strong> {customerInfo.email}
                            </p>
                            <p>
                              <strong>Teléfono:</strong> {customerInfo.phone}
                            </p>
                            {deliveryMethod === "shipping" &&
                              customerInfo.address && (
                                <p>
                                  <strong>Dirección:</strong>{" "}
                                  {customerInfo.address}, {customerInfo.city}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="bg-stone-50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">
                            Detalles del pedido
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Entrega:</strong>{" "}
                              {deliveryMethod === "pickup"
                                ? "Retiro en taller"
                                : "Envío a domicilio"}
                            </p>
                            <p>
                              <strong>Pago:</strong>{" "}
                              {paymentMethod === "mercadopago"
                                ? "Mercado Pago"
                                : "Transferencia bancaria"}
                            </p>
                            <p>
                              <strong>Total:</strong>{" "}
                              <span className="text-lg font-bold">
                                {formatPrice(calculateTotal())}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Términos y condiciones */}
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) =>
                              setAcceptTerms(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm leading-relaxed cursor-pointer"
                          >
                            Entiendo que recibiré información sobre mi pedido
                            por email y WhatsApp.
                          </Label>
                        </div>

                        {/* Información de seguridad */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Shield className="text-green-600 mr-2" size={20} />
                            <div>
                              <p className="font-medium text-green-800">
                                Compra segura
                              </p>
                              <p className="text-sm text-green-700">
                                Tus datos están protegidos y tu compra tiene
                                garantía de 6 meses.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botones de navegación */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="px-8 bg-transparent"
                >
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="bg-stone-800 hover:bg-stone-700 px-8"
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckout}
                    disabled={!acceptTerms || isProcessing}
                    className="bg-stone-800 hover:bg-stone-700 px-8"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2" size={18} />
                        Confirmar Pedido
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar de resumen */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Package className="mr-2 text-stone-600" size={20} />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de productos */}

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {state.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-2 bg-stone-50 rounded-lg"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                          <img
                            src={item.imageSrc || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Cálculos */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span
                        className={
                          calculateShipping() === 0
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        {calculateShipping() === 0
                          ? "Gratis"
                          : formatPrice(calculateShipping())}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
