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

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Adrianacostaorfebre",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre nuestras joyas artesanales, envíos, devoluciones, garantías y más.",
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center">
        <div className="container max-w-4xl py-16 px-4 md:px-6 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encuentra toda la información que necesitas sobre nuestras joyas
              artesanales, procesos de producción, envíos y políticas.
            </p>
          </div>

          {/* Guía de Tallas */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-8 text-center">
              Guía de Tallas
            </h2>
            <Tabs defaultValue="anillos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="anillos">Anillos</TabsTrigger>
                <TabsTrigger value="pulseras">Pulseras</TabsTrigger>
              </TabsList>

              <TabsContent value="anillos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Cómo medir tu talla de anillo
                      <Badge variant="secondary">Importante</Badge>
                    </CardTitle>
                    <CardDescription>
                      El tamaño de tus dedos varía durante el día, especialmente
                      con el calor. Si dudas entre dos tallas, elige la más
                      grande.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">
                          Método 1: Con un anillo existente
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Mide con una regla el diámetro interno de un anillo
                          que ya te quede bien, excluyendo el espesor del cuerpo
                          del anillo.
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-medium">
                            Los milímetros que obtengas = tu talle
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">
                          Método 2: Midiendo tu dedo
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Si no tienes ningún anillo, utiliza un centímetro y
                          mide la circunferencia de tu dedo.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                          <p className="text-sm text-amber-800">
                            💡 <strong>Consejo:</strong> Mide al final del día
                            cuando los dedos están más hinchados.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground">
                        <strong>Opción regulable:</strong> En varios modelos de
                        anillos, puedes elegir la opción regulable (abierto).
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pulseras" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Esclava Cerrada</CardTitle>
                      <CardDescription>
                        Para pulseras rígidas y cerradas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Decide en qué mano quieres lucir tu esclava</li>
                        <li>Busca un centímetro o regla para medir</li>
                        <li>
                          Si ya tienes una esclava que te quede bien, mide su
                          diámetro
                        </li>
                        <li>
                          Realiza la medición según las opciones mostradas
                        </li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Esclava Abierta</CardTitle>
                      <CardDescription>
                        Para pulseras flexibles y abiertas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
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
          </section>

          <Separator className="my-12" />

          {/* Sobre Nuestras Joyas */}
          <section className="mb-14">
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-8 text-center">
              Sobre Nuestras Joyas
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="materiales"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿De qué materiales están hechas sus joyas?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    <p className="mb-3">
                      Nuestras piezas son realizadas en plata 925, oro 18k y
                      piedras naturales cuidadosamente seleccionadas.
                    </p>
                    <p>
                      Cada pieza es una creación única, elaborada a mano
                      utilizando técnicas tradicionales de orfebrería.
                      Priorizamos que cada joya sea delicada e irrepetible,
                      respetando los tiempos del trabajo manual y revalorizando
                      este oficio ancestral.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cuidado" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cómo debo cuidar mis joyas para que duren más?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Para Joyas de Plata 925:
                      </h4>
                      <p className="mb-3">
                        La plata 925 es un metal noble que puede oscurecerse
                        naturalmente con el tiempo debido a la oxidación. Esto
                        no es un defecto, sino una característica de la plata, y
                        se puede limpiar fácilmente.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          <strong>
                            Evitá el contacto con productos químicos:
                          </strong>{" "}
                          Retirá tus joyas antes de usar perfumes, cremas,
                          sprays, lociones, productos de limpieza (cloro,
                          lavandina), o al ir a la piscina o al mar.
                        </li>
                        <li>
                          <strong>Guardado adecuado:</strong> Guarda tus joyas
                          en un lugar seco y oscuro, preferiblemente en bolsitas
                          individuales de tela o en un joyero forrado.
                        </li>
                        <li>
                          <strong>Limpieza regular:</strong> Limpia suavemente
                          con un paño especial para pulir plata o con una mezcla
                          de agua tibia y bicarbonato. Evita productos
                          abrasivos.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Para Joyas con Piedras Naturales:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          <strong>Protegé de golpes y caídas:</strong> Las
                          piedras pueden fracturarse o astillarse con golpes
                          fuertes.
                        </li>
                        <li>
                          <strong>Evitá cambios bruscos de temperatura:</strong>{" "}
                          Algunas piedras son sensibles al calor extremo o frío
                          intenso.
                        </li>
                        <li>
                          <strong>Cuidado con productos químicos:</strong>{" "}
                          Retirá tus joyas antes de aplicarte perfumes, sprays o
                          cremas.
                        </li>
                        <li>
                          <strong>Limpieza de piedras:</strong> Limpia con un
                          paño suave y húmedo. Para piedras porosas (turquesa,
                          ópalo), evita sumergirlas en agua.
                        </li>
                        <li>
                          <strong>Guardado:</strong> Protege las piedras de
                          rayones guardando tus joyas individualmente.
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="garantia" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Sus joyas tienen garantía?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-3">
                    <p>
                      Queremos que disfrutes de tu joya por mucho tiempo, por
                      eso ofrecemos una garantía que respalda la calidad de
                      nuestra artesanía y la pureza de los materiales.
                    </p>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Joyas artesanales:</strong> 1 año a partir de
                          la fecha de compra
                        </li>
                        <li>
                          <strong>Cadenitas:</strong> 30 días (fabricación
                          industrial, plata italiana 925)
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm">
                      <strong>
                        La garantía cubre únicamente defectos de fabricación.
                      </strong>{" "}
                      No aplica para daños causados por uso cotidiano, caídas,
                      golpes, cuidado inadecuado, maltrato o contacto con
                      productos químicos.
                    </p>
                    <p className="text-sm">
                      El oscurecimiento de la plata es un proceso natural y no
                      se considera un defecto.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="disponibilidad"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cómo funciona la disponibilidad de las piezas?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    <p className="mb-3">
                      Apostamos a una producción consciente, nuestro stock es
                      limitado y la mayoría de las piezas son hechas
                      especialmente para cada cliente.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        <strong>Si la pieza está en stock:</strong> Podrás
                        retirarla directamente en nuestro taller previa agenda o
                        coordinar un retiro.
                      </li>
                      <li>
                        <strong>Si no está en stock:</strong> Pautaremos el
                        plazo de producción y coordinaremos la entrega.
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator className="my-10" />

          {/* Envíos y Entregas */}
          <section className="mb-14">
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-8 text-center">
              Envíos y Entregas
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="tiempo-produccion"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuánto tiempo demora mi pedido?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-3">
                    <p>
                      Queremos que sepas que todas nuestras joyas se realizan
                      por encargo. Una vez confirmado tu pedido, el tiempo
                      estimado de producción es de{" "}
                      <strong>10 días hábiles</strong>. A este plazo se le suma
                      el tiempo de envío.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Fechas especiales:</strong> Los plazos de
                        entrega podrán verse afectados en fechas especiales
                        (descuentos, día de la madre, fiestas, etc.)
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Los pedidos se procesan de lunes a viernes</li>
                      <li>
                        Cuando tu pedido esté listo y despachado recibirás un
                        email
                      </li>
                      <li>
                        Agradecemos tu paciencia, que es parte del proceso para
                        recibir una joya única y hecha a mano especialmente para
                        ti
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="metodos-envio"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuáles son los métodos de envío?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        En Montevideo:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Envíos por cadетería</li>
                        <li>Retiro en el taller previa coordinación</li>
                        <li>
                          Una vez acreditado el pago coordinaremos fecha y
                          horario de envío
                        </li>
                        <li>Los envíos corren por cuenta del cliente</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Envíos al interior:
                      </h4>
                      <p className="text-sm">
                        Lo enviamos a través de DAC (a cobrar).
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="envios-exterior"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Hacen envíos al exterior?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    <p>Por el momento solo hacemos envíos dentro de Uruguay.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator className="my-10" />

          {/* Políticas */}
          <section className="mb-14">
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-8 text-center">
              Políticas de Devolución y Cambios
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="devoluciones"
                className="border-b border-muted"
              >
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuál es la política de devoluciones?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-3">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        No se aceptan devoluciones salvo por defectos de
                        fabricación.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Condiciones para devolución:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          La pieza debe estar en perfectas condiciones, sin
                          signos de haber sido usada
                        </li>
                        <li>Debe estar limpia y en su embalaje original</li>
                        <li>
                          El remitente es responsable de los gastos de envío de
                          la devolución
                        </li>
                        <li>Los gastos de envío no son reembolsables</li>
                        <li>Revisa tu pedido en cuanto lo recibas</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Importante recordar:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          Las piezas se realizan especialmente para cada cliente
                        </li>
                        <li>
                          Cada pieza es hecha a mano y es única - no hay dos
                          piezas iguales
                        </li>
                        <li>
                          Las piedras naturales pueden variar - no hay dos
                          piedras idénticas
                        </li>
                        <li>
                          Las piezas personalizadas, a medida, grabados y
                          pedidos especiales no tienen devolución
                        </li>
                        <li>No se hacen devoluciones de dinero</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cambios" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Qué tipos de cambios aceptan?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Cambios por defecto de fabricación:
                      </h4>
                      <p className="text-sm">
                        La pieza será reparada o cambiada sin costo adicional
                        siempre y cuando no sea por mal uso.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Cambios de talle:
                      </h4>
                      <p className="text-sm">
                        El cambio de talle se realizará sin costo la primera
                        vez. Los gastos de envío corren por cuenta del
                        comprador.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Cambios generales:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          Se pueden realizar hasta 3 días hábiles a partir de la
                          fecha de entrega
                        </li>
                        <li>
                          Solo por productos de igual o mayor valor que la
                          compra inicial
                        </li>
                        <li>
                          Deben estar en perfectas condiciones con su packaging
                          correspondiente
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>No se cambian:</strong> Piezas personalizadas
                        como medallas, dijes con grabados o dibujos.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No encontraste lo que buscabas?
              <a
                href="/contacto"
                className="ml-2 font-medium underline underline-offset-4 hover:text-primary"
              >
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
