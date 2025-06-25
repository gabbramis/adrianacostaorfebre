"use client";

import { Producto } from "@/app/admin/products/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { createSupabaseClient } from "@/utils/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Tipos para los productos
type ProductCategory =
  | "anillos"
  | "colgantes"
  | "pulseras"
  | "caravanas"
  | "marcalibros"
  | "prendedores"
  | "llaveros"
  | "todos";
type SortOption = "popular" | "recent" | "price-low" | "price-high" | "name";

const sortOptions = [
  { id: "popular", name: "Más populares" },
  { id: "recent", name: "Más recientes" },
  { id: "price-low", name: "Precio: menor a mayor" },
  { id: "price-high", name: "Precio: mayor a menor" },
  { id: "name", name: "Nombre A-Z" },
];

export default function GalleryPage() {
  const getPrimaryImageSrc = (product: Producto): string => {
    return product.image && product.image.length > 0
      ? product.image[0]
      : "/placeholder-image.jpg";
  };
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("todos");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const { addItem, openCart } = useCart();

  // Cargar productos desde Supabase
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          console.error("Error al cargar productos:", error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Calcular categorías dinámicamente
  const categories = [
    { id: "todos", name: "Todos los productos", count: products.length },
    {
      id: "anillos",
      name: "Anillos",
      count: products.filter((p) => p.category === "anillos").length,
    },
    {
      id: "pulseras",
      name: "Pulseras",
      count: products.filter((p) => p.category === "pulseras").length,
    },
    {
      id: "colgantes",
      name: "Colgantes",
      count: products.filter((p) => p.category === "colgantes").length,
    },
    {
      id: "caravanas",
      name: "Caravanas",
      count: products.filter((p) => p.category === "caravanas").length,
    },
    {
      id: "marcalibros",
      name: "Marcalibros",
      count: products.filter((p) => p.category === "marcalibros").length,
    },
    {
      id: "prendedores",
      name: "Prendedores",
      count: products.filter((p) => p.category === "prendedores").length,
    },
    {
      id: "llaveros",
      name: "Llaveros",
      count: products.filter((p) => p.category === "llaveros").length,
    },
  ];

  // Obtener materiales únicos
  const allMaterials = Array.from(
    new Set(products.flatMap((p) => p.materials || []))
  );

  // Obtener término de búsqueda de la URL si existe
  useEffect(() => {
    const querySearch = searchParams.get("buscar");
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== "todos") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description?.toLowerCase().includes(searchTermLower) ||
          (product.materials &&
            product.materials.some((material) =>
              material.toLowerCase().includes(searchTermLower)
            ))
      );
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    // Filtrar por materiales
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        selectedMaterials.some((material) =>
          product.materials?.includes(material)
        )
      );
    }

    // Ordenar productos
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [
    products,
    selectedCategory,
    searchTerm,
    sortBy,
    priceRange,
    selectedMaterials,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const navigateProduct = (direction: "next" | "prev") => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(
      (p) => p.id === selectedProduct.id
    );
    let newIndex;
    if (direction === "next") {
      newIndex =
        currentIndex === filteredProducts.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex =
        currentIndex === 0 ? filteredProducts.length - 1 : currentIndex - 1;
    }
    setSelectedProduct(filteredProducts[newIndex]);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleAddToCart = (product: Producto) => {
    const primaryImageSrc = getPrimaryImageSrc(product);
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      imageSrc: primaryImageSrc,
      category: product.category,
      materials: product.materials || [],
    });
    openCart();
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  // Mostrar loading mientras se cargan los productos
  if (loading) {
    return (
      <main className="pt-0">
        <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-serif mb-4">
              Galería de Productos
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300">
              Explora nuestra colección completa de joyería artesanal, cada
              pieza creada con pasión y dedicación.
            </p>
          </div>
        </div>
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="mx-auto animate-spin mb-4" size={48} />
            <p className="text-lg text-gray-600">Cargando productos...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="pt-0">
        {/* Banner de la galería */}
        <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-serif mb-4">
              Galería de Productos
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300">
              Explora nuestra colección completa de joyería artesanal, cada
              pieza creada con pasión y dedicación.
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <section className="py-8 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar de filtros */}
              <div className="lg:w-80 space-y-6">
                {/* Buscador */}
                <Card className="p-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </Card>

                {/* Filtros móviles */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full"
                  >
                    <Filter className="mr-2" size={18} />
                    Filtros
                    <ChevronDown
                      className={`ml-2 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                      size={18}
                    />
                  </Button>
                </div>

                {/* Filtros */}
                <div
                  className={`space-y-6 ${
                    showFilters ? "block" : "hidden lg:block"
                  }`}
                >
                  {/* Categorías */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <SlidersHorizontal className="mr-2" size={18} />
                      Categorías
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            setSelectedCategory(category.id as ProductCategory)
                          }
                          className={`w-full text-left p-2 rounded-lg transition-colors flex justify-between items-center ${
                            selectedCategory === category.id
                              ? "bg-stone-800 text-white"
                              : "hover:bg-stone-100"
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Materiales */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Materiales</h3>
                    <div className="space-y-2">
                      {allMaterials.map((material) => (
                        <label
                          key={material}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material)}
                            onChange={() => toggleMaterial(material)}
                            className="rounded border-stone-300"
                          />
                          <span className="text-sm">{material}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="flex-1">
                {/* Header con ordenamiento */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {isSearching
                        ? `Resultados para "${searchTerm}"`
                        : "Todos los productos"}
                    </h2>
                    <p className="text-gray-600">
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "producto" : "productos"}
                      {selectedCategory !== "todos" &&
                        ` en ${selectedCategory}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <span className="text-sm text-gray-600">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid de productos */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${sortBy}-${priceRange}-${selectedMaterials.join(
                      ","
                    )}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                className="cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="relative h-64 overflow-hidden">
                                  <img
                                    src={getPrimaryImageSrc(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                              </div>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-serif">
                                  {product.name}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="relative h-80 md:h-96 bg-stone-100 rounded-md overflow-hidden">
                                  {product.image && product.image.length > 0 ? (
                                    <Carousel className="w-full h-full">
                                      <CarouselContent>
                                        {product.image.map((url, index) => (
                                          <CarouselItem key={index}>
                                            <div className="w-full h-full flex items-center justify-center">
                                              <img
                                                src={url}
                                                alt={`${
                                                  product.name
                                                } - Imagen ${index + 1}`}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                          </CarouselItem>
                                        ))}
                                      </CarouselContent>
                                      {product.image.length > 1 && (
                                        <>
                                          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                                        </>
                                      )}
                                    </Carousel>
                                  ) : (
                                    <img
                                      src="/placeholder-image.jpg"
                                      alt="Imagen no disponible"
                                      className="w-full h-full object-contain bg-gray-200"
                                    />
                                  )}
                                </div>

                                <div>
                                  <DialogDescription className="text-base text-gray-700 mb-4">
                                    {product.description}
                                  </DialogDescription>

                                  {product.materials &&
                                    product.materials.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                                          Materiales
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {product.materials.map(
                                            (material, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="outline"
                                              >
                                                {material}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {product.popularity && (
                                    <div className="mb-4">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              size={16}
                                              className={
                                                i <
                                                Math.floor(product.popularity!)
                                                  ? "text-yellow-400 fill-current"
                                                  : "text-gray-300"
                                              }
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                          ({product.popularity})
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                      Precio
                                    </h4>
                                    <p className="text-2xl font-semibold">
                                      {formatPrice(product.price)}
                                    </p>
                                  </div>

                                  <div className="flex gap-3">
                                    <Button className="flex-1">
                                      Comprar Ahora
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => handleAddToCart(product)}
                                    >
                                      <ShoppingCart
                                        className="mr-2"
                                        size={16}
                                      />
                                      Añadir al Carrito
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between mt-6">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigateProduct("prev")}
                                >
                                  <ChevronLeft size={24} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigateProduct("next")}
                                >
                                  <ChevronRight size={24} />
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {product.name}
                              </h3>
                            </div>

                            {product.popularity && (
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i < Math.floor(product.popularity!)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({product.popularity})
                                </span>
                              </div>
                            )}

                            <p className="text-lg font-semibold text-stone-800 mb-3">
                              {formatPrice(product.price)}
                            </p>

                            <Button
                              size="sm"
                              className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart size={14} className="mr-1" />
                              Añadir al carrito
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredProducts.length === 0 && !loading && (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-lg text-gray-500 mb-4">
                      No se encontraron productos que coincidan con tus filtros.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearSearch();
                        setSelectedCategory("todos");
                        setPriceRange("all");
                        setSelectedMaterials([]);
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-stone-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Podemos crear una pieza personalizada especialmente para ti.
              Contáctanos para discutir tus ideas y convertirlas en una joya
              única.
            </p>
            <Button className="bg-stone-800 hover:bg-stone-700 text-white">
              Solicitar Diseño Personalizado
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
