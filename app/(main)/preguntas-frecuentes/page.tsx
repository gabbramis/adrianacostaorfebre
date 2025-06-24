import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gem,
  Clock,
  Shield,
  Truck,
  RotateCcw,
  Ruler,
  Heart,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Adrianacostaorfebre",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre nuestras joyas artesanales, envíos, devoluciones, garantías y más.",
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200 py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 mb-6">
              <Gem className="w-3 h-3" />
              Joyas Artesanales
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-gray-900">
              Preguntas Frecuentes
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Encuentra toda la información que necesitas sobre nuestras joyas
              artesanales, procesos de producción, envíos y políticas.
            </p>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-16 space-y-16">
          {/* Guía de Tallas */}
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                <Ruler className="w-3 h-3" />
                Guía de Tallas
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900">
                Cómo elegir tu talla
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="anillos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="anillos"
                    className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Gem className="w-4 h-4 mr-2" />
                    Anillos
                  </TabsTrigger>
                  <TabsTrigger
                    value="pulseras"
                    className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Pulseras
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="anillos" className="mt-6 space-y-6">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-serif flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Ruler className="w-4 h-4 text-gray-600" />
                            </div>
                            Cómo medir tu talla de anillo
                          </CardTitle>
                          <CardDescription className="mt-2">
                            El tamaño de tus dedos varía durante el día,
                            especialmente con el calor.
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          Importante
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              1
                            </div>
                            <h4 className="font-medium text-gray-900">
                              Con un anillo existente
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Mide con una regla el diámetro interno de un anillo
                            que ya te quede bien, excluyendo el espesor del
                            cuerpo del anillo.
                          </p>
                          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Los milímetros que obtengas = tu talle
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              2
                            </div>
                            <h4 className="font-medium text-gray-900">
                              Midiendo tu dedo
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Si no tienes ningún anillo, utiliza un centímetro y
                            mide la circunferencia de tu dedo.
                          </p>
                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                            <p className="text-sm text-amber-800">
                              <strong>Consejo:</strong> Mide al final del día
                              cuando los dedos están más hinchados.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <strong>Opción regulable:</strong> En varios modelos
                          de anillos, puedes elegir la opción regulable
                          (abierto).
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pulseras" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </div>
                          Esclava Cerrada
                        </CardTitle>
                        <CardDescription>
                          Para pulseras rígidas y cerradas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {[
                            "Decide en qué mano quieres lucir tu esclava",
                            "Busca un centímetro o regla para medir",
                            "Si ya tienes una esclava que te quede bien, mide su diámetro",
                            "Realiza la medición según las opciones mostradas",
                          ].map((step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Gem className="w-4 h-4 text-gray-600" />
                          </div>
                          Esclava Abierta
                        </CardTitle>
                        <CardDescription>
                          Para pulseras flexibles y abiertas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Mide la circunferencia de tu muñeca con un centímetro
                          flexible.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Importante:</strong> Cuando realices tu
                            compra, ingresa en NOTAS la medida que obtuviste.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Sobre Nuestras Joyas */}
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                <Gem className="w-3 h-3" />
                Artesanía
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900">
                Sobre Nuestras Joyas
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="materiales"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Gem className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿De qué materiales están hechas sus joyas?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3 text-gray-600 leading-relaxed">
                      <p>
                        Nuestras piezas son realizadas en{" "}
                        <strong className="text-gray-900">plata 925</strong>,{" "}
                        <strong className="text-gray-900">oro 18k</strong> y{" "}
                        <strong className="text-gray-900">
                          piedras naturales
                        </strong>{" "}
                        cuidadosamente seleccionadas.
                      </p>
                      <p>
                        Cada pieza es una creación única, elaborada a mano
                        utilizando técnicas tradicionales de orfebrería.
                        Priorizamos que cada joya sea delicada e irrepetible,
                        respetando los tiempos del trabajo manual y
                        revalorizando este oficio ancestral.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="cuidado"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Cómo debo cuidar mis joyas para que duren más?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-600" />
                          Para Joyas de Plata 925:
                        </h4>
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                          La plata 925 es un metal noble que puede oscurecerse
                          naturalmente con el tiempo debido a la oxidación. Esto
                          no es un defecto, sino una característica de la plata,
                          y se puede limpiar fácilmente.
                        </p>
                        <ul className="space-y-2 text-sm">
                          {[
                            {
                              title: "Evitá el contacto con productos químicos",
                              desc: "Retirá tus joyas antes de usar perfumes, cremas, sprays, lociones, productos de limpieza (cloro, lavandina), o al ir a la piscina o al mar.",
                            },
                            {
                              title: "Guardado adecuado",
                              desc: "Guarda tus joyas en un lugar seco y oscuro, preferiblemente en bolsitas individuales de tela o en un joyero forrado.",
                            },
                            {
                              title: "Limpieza regular",
                              desc: "Limpia suavemente con un paño especial para pulir plata o con una mezcla de agua tibia y bicarbonato. Evita productos abrasivos.",
                            },
                          ].map((item, index) => (
                            <li key={index} className="flex gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <strong className="text-gray-900">
                                  {item.title}:
                                </strong>
                                <span className="text-gray-600 ml-1">
                                  {item.desc}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Gem className="w-4 h-4 text-gray-600" />
                          Para Joyas con Piedras Naturales:
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {[
                            {
                              title: "Protegé de golpes y caídas",
                              desc: "Las piedras pueden fracturarse o astillarse con golpes fuertes.",
                            },
                            {
                              title: "Evitá cambios bruscos de temperatura",
                              desc: "Algunas piedras son sensibles al calor extremo o frío intenso.",
                            },
                            {
                              title: "Cuidado con productos químicos",
                              desc: "Retirá tus joyas antes de aplicarte perfumes, sprays o cremas.",
                            },
                            {
                              title: "Limpieza de piedras",
                              desc: "Limpia con un paño suave y húmedo. Para piedras porosas (turquesa, ópalo), evita sumergirlas en agua.",
                            },
                            {
                              title: "Guardado",
                              desc: "Protege las piedras de rayones guardando tus joyas individualmente.",
                            },
                          ].map((item, index) => (
                            <li key={index} className="flex gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <strong className="text-gray-900">
                                  {item.title}:
                                </strong>
                                <span className="text-gray-600 ml-1">
                                  {item.desc}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="garantia"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Sus joyas tienen garantía?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        Queremos que disfrutes de tu joya por mucho tiempo, por
                        eso ofrecemos una garantía que respalda la calidad de
                        nuestra artesanía y la pureza de los materiales.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              1
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Joyas artesanales
                              </p>
                              <p className="text-sm text-gray-600">
                                1 año desde la compra
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              30
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Cadenitas
                              </p>
                              <p className="text-sm text-gray-600">
                                30 días (plata italiana 925)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong className="text-gray-900">
                            La garantía cubre únicamente defectos de
                            fabricación.
                          </strong>{" "}
                          No aplica para daños causados por uso cotidiano,
                          caídas, golpes, cuidado inadecuado, maltrato o
                          contacto con productos químicos.
                        </p>
                        <p>
                          El oscurecimiento de la plata es un proceso natural y
                          no se considera un defecto.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="disponibilidad"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Cómo funciona la disponibilidad de las piezas?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        Apostamos a una producción consciente, nuestro stock es
                        limitado y la mayoría de las piezas son hechas
                        especialmente para cada cliente.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">
                            Si está en stock
                          </h5>
                          <p className="text-sm text-green-700">
                            Podrás retirarla directamente en nuestro taller
                            previa agenda o coordinar un retiro.
                          </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                          <h5 className="font-medium text-amber-800 mb-2">
                            Si no está en stock
                          </h5>
                          <p className="text-sm text-amber-700">
                            Pautaremos el plazo de producción y coordinaremos la
                            entrega.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Envíos y Entregas */}
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                <Truck className="w-3 h-3" />
                Envíos
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900">
                Envíos y Entregas
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="tiempo-produccion"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Cuánto tiempo demora mi pedido?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        Queremos que sepas que todas nuestras joyas se realizan
                        por encargo. Una vez confirmado tu pedido, el tiempo
                        estimado de producción es de{" "}
                        <strong className="text-gray-900">
                          10 días hábiles
                        </strong>
                        . A este plazo se le suma el tiempo de envío.
                      </p>
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <p className="text-amber-800 text-sm">
                          <strong>Fechas especiales:</strong> Los plazos de
                          entrega podrán verse afectados en fechas especiales
                          (descuentos, día de la madre, fiestas, etc.)
                        </p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        {[
                          {
                            text: "Los pedidos se procesan de lunes a viernes",
                          },
                          {
                            text: "Cuando tu pedido esté listo recibirás un email",
                          },
                          {
                            text: "Agradecemos tu paciencia por una joya única",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg text-center"
                          >
                            <p className="text-sm text-gray-600">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="metodos-envio"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Cuáles son los métodos de envío?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">
                            En Montevideo
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              Envíos por cadetería
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              Retiro en el taller previa coordinación
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              Los envíos corren por cuenta del cliente
                            </li>
                          </ul>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Envíos al interior
                          </h4>
                          <p className="text-sm text-gray-600">
                            Lo enviamos a través de <strong>DAC</strong> (a
                            cobrar).
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="envios-exterior"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Hacen envíos al exterior?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-800 text-sm">
                        Por el momento solo hacemos envíos dentro de Uruguay.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Políticas */}
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                <RotateCcw className="w-3 h-3" />
                Políticas
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900">
                Devoluciones y Cambios
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="devoluciones"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Cuál es la política de devoluciones?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-red-800 font-medium text-sm">
                          No se aceptan devoluciones salvo por defectos de
                          fabricación.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">
                            Condiciones para devolución:
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {[
                              "Pieza en perfectas condiciones, sin uso",
                              "Limpia y en su embalaje original",
                              "Gastos de envío por cuenta del remitente",
                              "Revisar el pedido al recibirlo",
                            ].map((condition, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">
                            Importante recordar:
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {[
                              "Piezas hechas especialmente para cada cliente",
                              "Cada pieza es única - no hay dos iguales",
                              "Piedras naturales pueden variar",
                              "Piezas personalizadas no tienen devolución",
                            ].map((note, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="cambios"
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-gray-600" />
                      </div>
                      ¿Qué tipos de cambios aceptan?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Cambios por defecto de fabricación
                          </h4>
                          <p className="text-sm text-gray-600">
                            La pieza será reparada o cambiada sin costo
                            adicional siempre y cuando no sea por mal uso.
                          </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Cambios de talle
                          </h4>
                          <p className="text-sm text-gray-600">
                            El cambio de talle se realizará sin costo la primera
                            vez. Los gastos de envío corren por cuenta del
                            comprador.
                          </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Cambios generales
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              Hasta 3 días hábiles desde la entrega
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              Por productos de igual o mayor valor
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              En perfectas condiciones con packaging
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800 font-medium text-sm">
                          <strong>No se cambian:</strong> Piezas personalizadas
                          como medallas, dijes con grabados o dibujos.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          <div className="text-center py-8">
            <div className="inline-flex items-center gap-4 bg-white border border-gray-200 px-6 py-3 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm">
                ¿No encontraste lo que buscabas?
              </p>
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
