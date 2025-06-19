"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toggleCart, getTotalItems } = useCart();

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manejar envío del formulario de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/galeria?buscar=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Enlaces de navegación
  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Galería", href: "/galeria" },
    { name: "Sobre Nosotros", href: "/#nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
  ];

  const totalItems = getTotalItems();

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-stone-100 py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative text-xl md:text-2xl font-serif text-stone-800 h-12 w-48"
          >
            {" "}
            {/* Add relative and define size here */}
            <Image
              src="/logo-header.png"
              alt="Logo de Adrianacostaorfebre"
              fill={true}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Navegación - Escritorio */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-stone-600 ${
                  pathname === link.href ? "text-stone-800" : "text-stone-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Acciones - Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Barra de búsqueda - Escritorio */}
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-[200px] transition-all duration-300 border-stone-300 focus:border-stone-500 focus:ring-stone-500 ${
                    isSearchOpen ? "opacity-100" : "opacity-0 w-0 p-0 border-0"
                  }`}
                />
                {isSearchOpen ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-1"
                  >
                    <X size={18} />
                    <span className="sr-only">Cerrar búsqueda</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search size={18} />
                    <span className="sr-only">Abrir búsqueda</span>
                  </Button>
                )}
              </form>
            </div>

            {/* Cuenta */}
            <Button variant="ghost" size="icon">
              <User size={20} />
              <span className="sr-only">Mi cuenta</span>
            </Button>

            {/* Carrito */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </div>

          {/* Menú móvil */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Búsqueda móvil */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Carrito móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>

            {/* Menú hamburguesa */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <span className="text-lg font-serif">Menú</span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X size={18} />
                        <span className="sr-only">Cerrar</span>
                      </Button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col space-y-4 py-6">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          href={link.href}
                          className={`text-lg py-2 transition-colors hover:text-stone-600 ${
                            pathname === link.href
                              ? "text-stone-800 font-medium"
                              : "text-stone-600"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-auto py-6 border-t">
                    <SheetClose asChild>
                      <Link
                        href="#"
                        className="flex items-center text-stone-600 hover:text-stone-800 transition-colors"
                      >
                        <User size={18} className="mr-2" />
                        <span>Mi cuenta</span>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Barra de búsqueda móvil expandible */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pb-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-stone-300"
                autoFocus
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="ml-2"
              >
                <Search size={18} />
                <span className="sr-only">Buscar</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
