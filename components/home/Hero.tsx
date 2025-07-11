"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gem } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JewelryHero() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[calc(100vh-80px)] md:h-[650px] lg:h-[800px] xl:h-[900px] overflow-hidden">
      {/* Overlay gradiente para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-[1]" />

      {/* Imagen para Dispositivos Móviles */}
      <img
        src="/hero1.jpg"
        alt="Joyería artesanal de Adriana Acosta"
        className="absolute inset-0 w-full h-full object-cover object-center block md:hidden"
      />

      {/* Imagen para Escritorio */}
      <img
        src="/hero6.png"
        alt="Joyería artesanal de Adriana Acosta"
        className="absolute inset-0 w-full h-full object-cover object-center hidden md:block"
      />

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <div className="space-y-8">
            {/* Badge de calidad */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
              <Gem className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">
                Piezas únicas hechas a mano
              </span>
            </div>

            <div className="space-y-6">
              <h1
                className="text-5xl lg:text-7xl xl:text-8xl font-light text-white leading-tight drop-shadow-2xl"
                style={{
                  fontFamily:
                    "Playfair Display, Cormorant Garamond, Times New Roman, serif",
                  fontStyle: "italic",
                }}
              >
                Una joya es un símbolo
              </h1>

              {/* Texto inspiracional mejorado */}
              <div className="space-y-4">
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl drop-shadow-md font-light">
                  Diseños únicos de joyería artesanal que expresan tu esencia
                  personal.
                </p>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => router.push("/galeria")}
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 text-base font-medium transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Sparkles className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                Explorar Colecciones
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Indicadores de valor */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/70">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span className="text-sm">Atención personalizada</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span className="text-sm">Garantía de calidad</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span className="text-sm">Diseños exclusivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
          <span className="text-xs text-white/50 uppercase tracking-wide">
            Conocer más
          </span>
        </div>
      </div>
    </section>
  );
}
