import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 top-0">
        <Image
          src="/joyeria-landing.jpg"
          alt="Plants and decorative planter"
          fill
          priority
          className="object-cover brightness-[0.85]"
        />
      </div>
      
      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl">
          <p className="text-white text-sm md:text-base uppercase tracking-widest mb-4">Adrianacostaorfebre</p>
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            Joyería Artesanal de Uruguay
          </h1>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center bg-black hover:bg-black/80 text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Descubre nuestras colecciones
          </Link>
        </div>
      </main>
    </div>
  )
}
