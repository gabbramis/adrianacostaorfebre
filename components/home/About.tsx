export default function AboutSection() {
  return (
    <section id="nosotros" className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Imagen */}
          <div className="relative group max-w-md mx-auto lg:max-w-none">
            <div className="aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200">
              <img
                src="/adriana-foto.jpg"
                alt="Adriana Costa Orfebre en su taller"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Elemento decorativo */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-black rounded-full opacity-60 -z-10"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-stone-900">
                Conocé la historia detrás de cada joya
              </h2>

              <div className="w-12 h-px bg-black"></div>
            </div>

            <div className="space-y-4 text-stone-700">
              <p className="text-base md:text-lg leading-relaxed">
                Soy Adriana, orfebre desde 2019. Me formé en la Escuela Pedro
                Figari y creo joyas artesanales en plata, oro y piedras
                naturales. Trabajo con técnicas tradicionales, priorizando que
                cada pieza sea delicada, irrepetible y con significado.
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                Mis creaciones no son solo accesorios: son símbolos personales.
                Hechas en Montevideo, con dedicación, para acompañarte en tu
                historia.
              </p>
            </div>

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-4">
              <div className="group">
                <div className="border-l-2 border-black pl-4 py-3 hover:pl-5 transition-all duration-300">
                  <span className="block text-xs uppercase tracking-wider font-medium text-stone-500 mb-1">
                    Materiales
                  </span>
                  <span className="text-sm font-medium text-stone-900">
                    Plata, Oro, Piedras naturales
                  </span>
                </div>
              </div>

              <div className="group">
                <div className="border-l-2 border-black pl-4 py-3 hover:pl-5 transition-all duration-300">
                  <span className="block text-xs uppercase tracking-wider font-medium text-stone-500 mb-1">
                    Hecho en
                  </span>
                  <span className="text-sm font-medium text-stone-900">
                    Montevideo, Uruguay
                  </span>
                </div>
              </div>

              <div className="group">
                <div className="border-l-2 border-black pl-4 py-3 hover:pl-5 transition-all duration-300">
                  <span className="block text-xs uppercase tracking-wider font-medium text-stone-500 mb-1">
                    Desde
                  </span>
                  <span className="text-sm font-medium text-stone-900">
                    2019
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
