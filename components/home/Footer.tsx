import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif mb-4">Adrianacostaorfebre</h3>
            <p className="text-stone-400 mb-6 max-w-md">
              Joyería artesanal en Uruguay. Joyas hechas a mano con plata, oro y
              piedras naturales. Diseños exclusivos, delicados y con identidad.
              Envíos desde Montevideo a todo el país.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-lg font-medium mb-4">Enlaces Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-stone-400 hover:text-white transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/galeria"
                className="text-stone-400 hover:text-white transition-colors"
              >
                Galeria
              </Link>
              <Link
                href="/#nosotros "
                className="text-stone-400 hover:text-white transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contacto"
                className="text-stone-400 hover:text-white transition-colors"
              >
                Contacto
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="text-stone-400 hover:text-white transition-colors"
              >
                Preguntas Frecuentes
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-stone-400" />
                <span className="text-stone-400">Montevideo, Uruguay</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-stone-400" />
                <a
                  href="mailto:adrianacostaorfebre@gmail.com"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  adrianacostaorfebre@gmail.com
                </a>
              </div>

              {/* Redes Sociales */}
              <div className="flex space-x-4 mt-4">
                <Link
                  target="_blank"
                  href="https://www.instagram.com/adrianacostaorfebre/"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  <IconBrandInstagram className="text-stone-400 size-7 hover:text-stone-300" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://www.facebook.com/adrianacostaorfebre"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  <IconBrandFacebook className="text-stone-400 size-7 hover:text-stone-300" />
                  <span className="sr-only ">Facebook</span>
                </Link>
                <Link
                  href="https://wa.me/59891840146"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  <IconBrandWhatsapp className="text-stone-400 size-7 hover:text-stone-300" />
                  <span className="sr-only ">Whatsapp</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 text-center text-stone-500 text-sm">
          <p>
            © {new Date().getFullYear()} Adrianacostaorfebre. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
