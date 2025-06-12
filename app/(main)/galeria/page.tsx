import GalleryPage from "@/components/home/GalleryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería de Productos | Adrianacostaorfebre",
  description:
    "Explora nuestra colección completa de joyería artesanal única hecha a mano en Uruguay.",
};

export default function GalleryPageServer() {
  return (
    <main>
      <GalleryPage />
    </main>
  );
}
