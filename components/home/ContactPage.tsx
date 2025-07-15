"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  CheckCircle2,
  Gem,
  Heart,
  Award,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  tipoConsulta: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    tipoConsulta: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          tipo_consulta: formData.tipoConsulta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setIsSubmitted(true);

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
          tipoConsulta: "general",
        });
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "Error al enviar el mensaje"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ubicación",
      content: "Montevideo, Uruguay",
      detail: "Barrio Prado",
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+598 91 840 146",
      detail: "WhatsApp disponible",
    },
    {
      icon: Mail,
      title: "Email",
      content: "adrianacostaorfebre@gmail.com",
      detail: "Respuesta en 24 horas",
    },
    {
      icon: Clock,
      title: "Horarios",
      content: "Lun - Vie: 9:00 - 18:00",
    },
  ];

  const services = [
    {
      icon: Gem,
      title: "Diseño Personalizado",
      description:
        "Creamos piezas únicas basadas en tus ideas y preferencias personales.",
    },
    {
      icon: Heart,
      title: "Reparación y Restauración",
      description:
        "Damos nueva vida a tus joyas favoritas con técnicas especializadas.",
    },
    {
      icon: Award,
      title: "Asesoramiento Especializado",
      description:
        "Te ayudamos a elegir la pieza perfecta para cada ocasión especial.",
    },
  ];

  return (
    <>
      <main className="pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="text-stone-300 mr-3" size={32} />
                <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide">
                  Contacto
                </h1>
                <Sparkles className="text-stone-300 ml-3" size={32} />
              </div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300 font-light leading-relaxed">
                Estamos aquí para ayudarte a encontrar la pieza perfecta o crear
                algo único especialmente para ti.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contenido Principal */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulario de Contacto */}
              <div>
                <h2 className="text-2xl md:text-3xl font-serif mb-6">
                  Envíanos un Mensaje
                </h2>

                {/* Mostrar error si existe */}
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {isSubmitted ? (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <CheckCircle2
                          className="mx-auto mb-4 text-green-600"
                          size={48}
                        />
                        <h3 className="text-lg font-medium text-green-800 mb-2">
                          ¡Mensaje Enviado!
                        </h3>
                        <p className="text-green-700">
                          Gracias por contactarnos. Te responderemos dentro de
                          las próximas 24 horas.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="nombre"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Nombre completo *
                        </label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Teléfono
                      </label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tipoConsulta"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Tipo de consulta
                      </label>
                      <select
                        id="tipoConsulta"
                        name="tipoConsulta"
                        value={formData.tipoConsulta}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                      >
                        <option value="general">Consulta general</option>
                        <option value="personalizado">
                          Diseño personalizado
                        </option>
                        <option value="reparacion">Reparación</option>
                        <option value="presupuesto">
                          Solicitar presupuesto
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="asunto"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Asunto *
                      </label>
                      <Input
                        id="asunto"
                        name="asunto"
                        type="text"
                        required
                        value={formData.asunto}
                        onChange={handleInputChange}
                        className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mensaje"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mensaje *
                      </label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={5}
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                        placeholder="Cuéntanos sobre tu proyecto, consulta o cualquier detalle que consideres importante..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-stone-800 hover:bg-stone-700 text-white py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={18} />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Información de Contacto */}
              <div>
                <h2 className="text-2xl md:text-3xl font-serif mb-6">
                  Información de Contacto
                </h2>

                <div className="space-y-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                          <info.icon className="text-stone-600" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {info.title}
                        </h3>
                        <p className="text-gray-700">{info.content}</p>
                        <p className="text-sm text-gray-500">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Redes Sociales */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Síguenos en Redes Sociales
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/adrianacostaorfebre/"
                      className="w-10 h-10 bg-stone-800 text-white rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors"
                    >
                      <Instagram size={20} />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a
                      href="https://www.facebook.com/adrianacostaorfebre"
                      className="w-10 h-10 bg-stone-800 text-white rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors"
                    >
                      <Facebook size={20} />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a
                      href="https://wa.me/59891840146"
                      className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle size={20} />
                      <span className="sr-only">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
              Nuestros Servicios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-stone-800 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                      <service.icon size={32} />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-stone-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">
              ¿Listo para Crear Algo Único?
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-stone-300">
              Ya sea que tengas una idea específica o necesites inspiración,
              estamos aquí para ayudarte a crear la pieza perfecta.
            </p>
            <Button className="bg-white text-stone-800 hover:bg-stone-100 text-lg px-8 py-6">
              Agendar Consulta Gratuita
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
