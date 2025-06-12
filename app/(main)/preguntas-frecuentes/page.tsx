import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Adrianacostaorfebre",
  description: "Encuentra respuestas a las preguntas más comunes sobre nuestras joyas, envíos, devoluciones y más.",
}

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center">
        <div className="container max-w-3xl py-16 px-4 md:px-6 lg:py-20">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-10 text-center">Preguntas Frecuentes</h1>

          <section className="mb-14">
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-8 text-center">Sobre Nuestras Joyas</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="materiales" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿De qué materiales están hechas sus joyas?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Nuestras joyas están elaboradas con plata 925, oro de 18k y piedras semipreciosas de alta calidad.
                    Todos nuestros materiales son cuidadosamente seleccionados para garantizar durabilidad y belleza en
                    cada pieza.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="talla" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cómo elijo la talla correcta de anillo o pulsera?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    En nuestra sección de guía de tallas encontrarás instrucciones detalladas para medir correctamente tu
                    dedo o muñeca. Si tienes dudas, puedes contactarnos directamente y te ayudaremos a encontrar la talla
                    perfecta para ti.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cuidado" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cómo debo cuidar mis joyas para que duren más?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Recomendamos guardar tus joyas en un lugar seco, evitar el contacto con perfumes, cremas y productos
                    químicos. Para la limpieza, utiliza un paño suave y, en el caso de la plata, productos específicos
                    para este material. Evita usar tus joyas durante actividades físicas intensas o al nadar.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="garantia" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Sus joyas tienen garantía?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Sí, todas nuestras joyas cuentan con una garantía de 6 meses que cubre defectos de fabricación. Esta
                    garantía no incluye daños por uso inadecuado, accidentes o desgaste normal. Para hacer efectiva la
                    garantía, conserva tu comprobante de compra.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator className="my-10" />

          <section>
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-8 text-center">Políticas y Envíos</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="metodos-envio" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuáles son los métodos de envío?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Ofrecemos envío estándar a través de correo nacional y envío express para entregas más rápidas. En
                    Montevideo también contamos con la opción de retiro en nuestra tienda física sin costo adicional.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="envios-exterior" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Hacen envíos al exterior?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Sí, realizamos envíos internacionales a través de courier. Los costos y tiempos de entrega varían
                    según el país de destino. Durante el proceso de compra podrás ver las opciones disponibles para tu
                    ubicación.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tiempo-entrega" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuánto tiempo tardará en llegar mi pedido?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed pt-0 pb-4">
                    Para envíos dentro de Uruguay, el tiempo estimado es de 3 a 5 días hábiles. Para envíos
                    internacionales, el tiempo de entrega varía entre 7 y 15 días hábiles, dependiendo del país de destino
                    y el método de envío seleccionado.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="devoluciones" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Cuál es su política de devoluciones?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4 animate-accordion-down">
                  Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto, siempre que la
                  joya se encuentre en su estado original, sin usar y con todas las etiquetas. Los gastos de envío para
                  devoluciones corren por cuenta del cliente, excepto en casos de productos defectuosos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="personalizacion" className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium py-4 transition-all hover:text-primary">
                  ¿Ofrecen joyas personalizadas?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4 animate-accordion-down">
                  Sí, ofrecemos servicios de personalización para ciertos modelos de joyas. Puedes solicitar grabados,
                  cambios en piedras o adaptaciones de diseño. Estos trabajos tienen un tiempo de producción adicional y
                  pueden tener un costo extra dependiendo de la complejidad.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No encontraste lo que buscabas?
              <a href="/contacto" className="ml-2 font-medium underline underline-offset-4 hover:text-primary">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </main>
    
    </>
  )
}
