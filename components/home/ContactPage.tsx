"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
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

  const preguntasFrecuentes = [
    {
      question: "¿Realizan trabajos personalizados?",
      answer:
        "Sí, nos especializamos en crear piezas únicas según tus ideas y preferencias. El proceso incluye una consulta inicial, diseño, aprobación y elaboración de la pieza.",
    },
    {
      question: "¿Cuánto tiempo toma hacer una pieza personalizada?",
      answer:
        "Dependiendo de la complejidad, una pieza personalizada puede tomar entre 2 a 4 semanas. Te mantendremos informado durante todo el proceso.",
    },
    {
      question: "¿Qué materiales utilizan?",
      answer:
        "Trabajamos principalmente con plata 925, oro 18k y piedras naturales seleccionadas. Todos nuestros materiales son de alta calidad y certificados.",
    },
    {
      question: "¿Ofrecen garantía en sus productos?",
      answer:
        "Sí, todas nuestras piezas tienen garantía de 6 meses contra defectos de fabricación. También ofrecemos servicio de mantenimiento y reparación.",
    },
    {
      question: "¿Realizan envíos a todo Uruguay?",
      answer:
        "Sí, realizamos envíos a todo el país. Los envíos a Montevideo son gratuitos en compras superiores a $2000. Para el interior, consultanos las tarifas.",
    },
    {
      question: "¿Puedo ver las piezas antes de comprar?",
      answer:
        "Por supuesto. Podés agendar una cita en nuestro taller para ver las piezas en persona y conocer nuestro proceso de trabajo.",
    },
  ];

  console.log(preguntasFrecuentes);

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
        <section className="bg-stone-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-serif mb-4">Contacto</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300">
              Estamos aquí para ayudarte a encontrar la pieza perfecta o crear
              algo único especialmente para ti.
            </p>
          </div>
        </section>

        {/* Contenido Principal */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulario de Contacto */}
              <div>
                <h2 className="text-2xl md:text-3xl font-serif mb-6">
                  Envíanos un Mensaje
                </h2>

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

        {/* Preguntas Frecuentes 
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">Preguntas Frecuentes</h2>
            
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="servicios">Servicios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-6">
                  <div className="space-y-4">
                    {faqs.slice(0, 3).map((faq, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="servicios" className="mt-6">
                  <div className="space-y-4">
                    {faqs.slice(3).map((faq, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        */}

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
