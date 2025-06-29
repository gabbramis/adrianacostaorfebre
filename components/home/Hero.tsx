import React from "react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] md:h-[650px] lg:h-[800px] xl:h-[900px] overflow-hidden">
      {/* Imagen para Dispositivos Móviles (visible en pantallas pequeñas, oculta en md y superiores) */}
      <img
        src="/hero-mobile.jpg"
        alt="Joyería artesanal de Adriana Acosta"
        className="absolute inset-0 w-full h-full object-cover object-center block md:hidden"
      />

      {/* Imagen para Escritorio (oculta en pantallas pequeñas, visible en md y superiores) */}
      <img
        src="/hero-desktop.jpg"
        alt="Mesa de trabajo de orfebre con herramientas y piezas de joyería."
        className="absolute inset-0 w-full h-full object-cover object-center hidden md:block"
      />
    </section>
  );
}
