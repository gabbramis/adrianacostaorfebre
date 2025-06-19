import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ProductSection() {
  return (
    <section id="colecciones" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          Explora Nuestros Productos
          {/* REEMPLAZAR ESTE TEXTO con el título de tu sección de colecciones */}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative aspect-square p-4">
              <img
                src="/producto-1.jpg"
                alt="Plata Reticulada Ring"
                className="object-contain w-full h-full transition-transform hover:scale-105 duration-500 shadow-sm"
              />
            </div>
            <CardContent className="pt-3 pb-2 px-4">
              <h3 className="text-lg font-medium mb-1">Colección Naturaleza</h3>
              <p className="text-sm text-gray-600 mb-3">
                Inspirada en las formas orgánicas y la belleza de la naturaleza
                uruguaya.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <Link href="#" className="w-full">
                <Button variant="outline" className="w-full text-sm py-2">
                  Ver Colección
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Colección 2 */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative aspect-square p-4">
              <img
                src="/producto-1.jpg"
                alt="Plata Reticulada Ring"
                className="object-contain w-full h-full transition-transform hover:scale-105 duration-500 shadow-sm"
              />
            </div>
            <CardContent className="pt-3 pb-2 px-4">
              <h3 className="text-lg font-medium mb-1">Colección Naturaleza</h3>
              <p className="text-sm text-gray-600 mb-3">
                Inspirada en las formas orgánicas y la belleza de la naturaleza
                uruguaya.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <Link href="#" className="w-full">
                <Button variant="outline" className="w-full text-sm py-2">
                  Ver Colección
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Colección 3 */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative aspect-square p-4">
              <img
                src="/producto-1.jpg"
                alt="Plata Reticulada Ring"
                className="object-contain w-full h-full transition-transform hover:scale-105 duration-500 shadow-sm"
              />
            </div>
            <CardContent className="pt-3 pb-2 px-4">
              <h3 className="text-lg font-medium mb-1">Colección Naturaleza</h3>
              <p className="text-sm text-gray-600 mb-3">
                Inspirada en las formas orgánicas y la belleza de la naturaleza
                uruguaya.
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <Link href="#" className="w-full">
                <Button variant="outline" className="w-full text-sm py-2">
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
