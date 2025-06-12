import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ProductSection() {
  return (
    <section id="colecciones" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          Explora Nuestras Colecciones
          {/* REEMPLAZAR ESTE TEXTO con el título de tu sección de colecciones */}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Colección 1 */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* REEMPLAZAR ESTA IMAGEN con una imagen de producto o colección */}
              <img
                src="/producto-1.jpg"
                alt="Colección Naturaleza"
                /* REEMPLAZAR ESTE ALT TEXT con una descripción relevante */
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-2">
                Colección Naturaleza
                {/* REEMPLAZAR ESTE TEXTO con el nombre de la colección */}
              </h3>
              <p className="text-gray-600 mb-4">
                Inspirada en las formas orgánicas y la belleza de la naturaleza
                uruguaya.
                {/* REEMPLAZAR ESTE TEXTO con la descripción de la colección */}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="w-full">
                {/* REEMPLAZAR ESTE ENLACE con la URL real de la página de colección */}
                <Button variant="outline" className="w-full">
                  Ver Colección
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Colección 2 */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* REEMPLAZAR ESTA IMAGEN con una imagen de producto o colección */}
              <img
                src="/producto-5.jpg"
                alt="Colección Geometría"
                /* REEMPLAZAR ESTE ALT TEXT con una descripción relevante */
                className=" object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-2">
                Colección Geometría
                {/* REEMPLAZAR ESTE TEXTO con el nombre de la colección */}
              </h3>
              <p className="text-gray-600 mb-4">
                Diseños minimalistas con líneas limpias y formas geométricas
                precisas.
                {/* REEMPLAZAR ESTE TEXTO con la descripción de la colección */}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="w-full">
                {/* REEMPLAZAR ESTE ENLACE con la URL real de la página de colección */}
                <Button variant="outline" className="w-full">
                  Ver Colección
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Colección 3 */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* REEMPLAZAR ESTA IMAGEN con una imagen de producto o colección */}
              <img
                src="/producto-6.jpg"
                alt="Colección Texturas"
                /* REEMPLAZAR ESTE ALT TEXT con una descripción relevante */
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-2">
                Colección Texturas
                {/* REEMPLAZAR ESTE TEXTO con el nombre de la colección */}
              </h3>
              <p className="text-gray-600 mb-4">
                Piezas con superficies ricas en texturas que juegan con la luz y
                las sombras.
                {/* REEMPLAZAR ESTE TEXTO con la descripción de la colección */}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="w-full">
                {/* REEMPLAZAR ESTE ENLACE con la URL real de la página de colección */}
                <Button variant="outline" className="w-full">
                  Ver Colección
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className="text-center mt-12">
          <Link href="/galeria">
            <Button variant="link" className="text-lg">
              Ver todos los productos →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
