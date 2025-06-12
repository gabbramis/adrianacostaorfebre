import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            {/* REEMPLAZAR ESTA IMAGEN con una imagen que muestre el proceso de elaboración o la artista */}
            <img
              src="/adriana-taller.jpg"
              alt="Adriana Costa Orfebre en su taller"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Nuestra Historia y Pasión
              {/* REEMPLAZAR ESTE TEXTO con el título de tu sección "Sobre Nosotros" */}
            </h2>

            <p className="text-lg mb-4 text-gray-700">
              Desde 2010, Adrianacostaorfebre ha estado creando piezas únicas de joyería artesanal en Uruguay. Cada
              creación nace de la pasión por transformar metales preciosos en obras de arte que cuentan historias.
              {/* REEMPLAZAR ESTE TEXTO con tu historia de marca */}
            </p>

            <p className="text-lg mb-6 text-gray-700">
              Nuestro taller en Montevideo es donde la magia sucede. Utilizamos técnicas tradicionales de orfebrería
              combinadas con diseños contemporáneos para crear joyas que son tan únicas como las personas que las
              llevan.
              {/* REEMPLAZAR ESTE TEXTO con más detalles sobre tu proceso o filosofía */}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 text-sm uppercase tracking-wider font-medium">
              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Materiales</span>
                <span>Plata 925 y Oro</span>
                {/* REEMPLAZAR ESTE TEXTO con tus materiales */}
              </div>

              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Hecho en</span>
                <span>Montevideo, Uruguay</span>
                {/* REEMPLAZAR ESTE TEXTO con tu ubicación */}
              </div>

              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Desde</span>
                <span>2010</span>
                {/* REEMPLAZAR ESTE TEXTO con tu año de fundación */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
