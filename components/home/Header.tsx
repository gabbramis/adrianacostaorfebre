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
  SheetHeader, // Added for better semantic structure of the sheet
  SheetTitle, // Added for the title within SheetHeader
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";

// Define navigation links as a constant outside the component for clarity
const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Galería", href: "/galeria" },
  { name: "Sobre Nosotros", href: "/#nosotros" }, // Note: Hash links may require additional scroll handling
  { name: "Contacto", href: "/contacto" },
  { name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toggleCart, getTotalItems } = useCart();

  // Effect to handle header scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/galeria?buscar=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false); // Close search bar after submitting
    }
  };

  const totalItemsInCart = getTotalItems();

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
            className="relative text-xl md:text-2xl font-serif text-stone-800 h-12 w-48 flex-shrink-0" // Added flex-shrink-0
          >
            <Image
              src="/logo-header.png"
              alt="Logo de Adrianacostaorfebre"
              fill
              style={{ objectFit: "contain" }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Added responsive sizes
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-6"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Search Bar */}
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`transition-all duration-300 border-stone-300 focus:border-stone-500 focus:ring-stone-500 ${
                    isSearchOpen
                      ? "w-[200px] opacity-100"
                      : "w-0 p-0 border-0 opacity-0"
                  }`}
                  aria-label="Campo de búsqueda" // Added aria-label for accessibility
                />
                {isSearchOpen ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-1"
                    aria-label="Cerrar búsqueda"
                  >
                    <X size={18} aria-hidden="true" />
                    <span className="sr-only">Cerrar búsqueda</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Abrir búsqueda"
                  >
                    <Search size={18} aria-hidden="true" />
                    <span className="sr-only">Abrir búsqueda</span>
                  </Button>
                )}
              </form>
            </div>

            {/* Desktop Account Button */}
            <Link href="/account" passHref>
              {" "}
              {/* Changed Button to Link for better semantic HTML */}
              <Button variant="ghost" size="icon" aria-label="Mi cuenta">
                <User size={20} aria-hidden="true" />
                <span className="sr-only">Mi cuenta</span>
              </Button>
            </Link>

            {/* Desktop Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label={`Ver carrito, ${totalItemsInCart} artículos`} // Dynamic aria-label
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {totalItemsInCart > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center p-0">
                  {totalItemsInCart}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </div>

          {/* Mobile Menu & Actions */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Alternar barra de búsqueda"
            >
              <Search size={20} aria-hidden="true" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Mobile Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label={`Ver carrito, ${totalItemsInCart} artículos`} // Dynamic aria-label
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {totalItemsInCart > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center p-0">
                  {totalItemsInCart}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>

            {/* Mobile Hamburger Menu (Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu size={20} aria-hidden="true" />
                  <span className="sr-only">Abrir menú de navegación</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] flex flex-col"
              >
                <SheetHeader className="flex flex-row items-center justify-between py-4 border-b px-6">
                  <SheetTitle className="text-xl font-serif text-stone-800">
                    Menú
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Cerrar menú"
                      className="hover:bg-stone-100" // Added hover state for the close button
                    >
                      <X size={20} aria-hidden="true" />{" "}
                      <span className="sr-only">Cerrar menú</span>
                    </Button>
                  </SheetClose>
                </SheetHeader>
                <nav
                  className="flex flex-col flex-grow py-6 overflow-y-auto px-6"
                  aria-label="Navegación del menú móvil"
                >
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.name}>
                      <Link
                        href={link.href}
                        className={`
              relative flex items-center py-2.5 px-4 rounded-md text-base font-medium
              transition-colors duration-200
              ${
                pathname === link.href
                  ? "bg-stone-100 text-stone-800 font-semibold" // Active link style
                  : "text-stone-700 hover:bg-stone-50 hover:text-stone-900" // Inactive link hover
              }
            `}
                      >
                        {link.name}
                        {pathname === link.href && ( // Optional: Add a subtle indicator for active link
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-stone-800 rounded-full" />
                        )}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="py-6 border-t px-6">
                  <SheetClose asChild>
                    <Link
                      href="/account"
                      className="flex items-center text-stone-700 hover:text-stone-900 transition-colors py-2 px-4 rounded-md hover:bg-stone-50" // Added padding and hover
                    >
                      <User size={20} className="mr-3" aria-hidden="true" />{" "}
                      <span className="font-medium">Mi cuenta</span>{" "}
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pb-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-stone-300"
                autoFocus // Automatically focus the input when it appears
                aria-label="Campo de búsqueda móvil"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="ml-2"
                aria-label="Buscar productos"
              >
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Buscar</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
