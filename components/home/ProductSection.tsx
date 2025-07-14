import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ProductSection() {
  const collections = [
    {
      title: "Colección Naturaleza",
      description:
        "Inspirada en las formas orgánicas y la belleza de la naturaleza uruguaya.",
      image: "/producto-4.jpg",
      alt: "Caravanas de la Colección Naturaleza",
      link: "/galeria",
      buttonText: "Ver Caravanas",
    },
    {
      title: "Nuestros Colgantes",
      description:
        "Diseños en plata y piedras naturales que evocan la armonía y fuerza de la naturaleza uruguaya.",
      image: "/producto-6.jpg",
      alt: "Colgantes artesanales en plata",
      link: "/galeria",
      buttonText: "Ver Colgantes",
    },
    {
      title: "Nuestros Anillos",
      description:
        "Diseños en plata y piedras naturales que reflejan la belleza orgánica de la naturaleza uruguaya.",
      image: "/producto-1.jpg",
      alt: "Anillos artesanales únicos",
      link: "/galeria",
      buttonText: "Ver Anillos",
    },
  ];

  return (
    <section id="colecciones" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-stone-900 mb-4">
            Explorá Nuestras Colecciones
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-4"></div>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
            Cada pieza cuenta una historia única, creada con técnicas
            artesanales y materiales nobles
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white"
            >
              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden bg-stone-50">
                <img
                  src={collection.image}
                  alt={collection.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
              </div>

              {/* Contenido */}
              <CardContent className="p-6">
                <h3 className="text-lg md:text-xl font-serif text-stone-900 mb-3 group-hover:text-black transition-colors duration-300">
                  {collection.title}
                </h3>
                <p className="text-sm md:text-base text-stone-600 leading-relaxed line-clamp-3">
                  {collection.description}
                </p>
              </CardContent>

              {/* Footer */}
              <CardFooter className="px-6 pb-6 pt-0">
                <Link href={collection.link} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-stone-200 text-stone-700 hover:bg-black hover:border-black hover:text-black transition-all duration-300 py-2.5"
                  >
                    {collection.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-12 md:mt-16">
          <Link href="/galeria">
            <Button
              variant="ghost"
              className="text-black hover:text-black hover:bg-black text-base md:text-lg font-medium px-8 py-3 transition-all duration-300"
            >
              Ver toda la galería
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
