import ContactPage from "@/components/home/ContactPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto | Adrianacostaorfebre",
  description:
    "Ponte en contacto con nosotros para consultas sobre joyería artesanal, diseños personalizados o cualquier pregunta sobre nuestros productos.",
}

export default function ContactoPage() {
  return <ContactPage />
}
