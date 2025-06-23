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
              Nuestra Historia y Pasión
            </h2>

            <p className="text-lg mb-4 text-gray-700">
              Soy Adriana, desde el año 2019 comencé mi formación como Orfebre
              en la Escuela Pedro Figari. Trabajo con plata ,oro y piedras
              naturales, utilizando técnicas tradicionales.
            </p>

            <p className="text-lg mb-6 text-gray-700">
              Priorizo que cada joya sea delicada e irrepetible. Respetando los
              tiempos del trabajo manual, revalorizando este oficio. Por eso más
              que un accesorio; estás llevando una pieza hecha a mano, única y
              con un significado especial, creada para perdurar y acompañarte en
              tu propia historia.
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
