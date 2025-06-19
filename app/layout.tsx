import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import CartDrawer from "@/components/home/CartDrawer";

export const metadata: Metadata = {
  title: "Adrianacostaorfebre | Joyería Artesanal de Uruguay",
  description:
    "Joyería artesanal única hecha a mano en Uruguay. Descubre nuestras colecciones de piezas exclusivas creadas con pasión y materiales de calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
