import CartPage from "@/components/home/CartPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carrito de Compras | Adrianacostaorfebre",
  description: "Revisa los productos en tu carrito y procede con tu compra de joyería artesanal única.",
}

export default function CarritoPage() {
  return <CartPage />
}
