export default function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <img
              src="/adriana-foto.jpg"
              alt="Adriana Costa Orfebre en su taller"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Conocé la historia detrás de cada joya
            </h2>

            <p className="text-lg mb-4 text-gray-700">
              Soy Adriana, orfebre desde 2019. Me formé en la Escuela Pedro
              Figari y creo joyas artesanales en plata, oro y piedras naturales.
              Trabajo con técnicas tradicionales, priorizando que cada pieza sea
              delicada, irrepetible y con significado.
            </p>

            <p className="text-lg mb-6 text-gray-700">
              Mis creaciones no son solo accesorios: son símbolos personales.
              Hechas en Montevideo, con dedicación, para acompañarte en tu
              historia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 text-sm uppercase tracking-wider font-medium">
              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Materiales</span>
                <span>Plata, Oro, Piedras naturales</span>
              </div>

              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Hecho en</span>
                <span>Montevideo, Uruguay</span>
              </div>

              <div className="border-l-2 border-black pl-4 py-2">
                <span className="block text-gray-500">Desde</span>
                <span>2019</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
