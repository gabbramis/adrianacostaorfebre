"use client";

import type { Producto } from "@/app/admin/products/page";
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
  Sparkles,
  Package,
  DollarSign,
  Gem,
} from "lucide-react";
import Link from "next/link";
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

const priceRanges = [
  {
    id: "all",
    name: "Todos los precios",
    min: 0,
    max: Number.POSITIVE_INFINITY,
  },
  { id: "under-1000", name: "Menos de $1,000", min: 0, max: 1000 },
  { id: "1000-1500", name: "$1,000 - $1,500", min: 1000, max: 1500 },
  { id: "1500-2000", name: "$1,500 - $2,000", min: 1500, max: 2000 },
  {
    id: "over-2000",
    name: "Más de $2,000",
    min: 2000,
    max: Number.POSITIVE_INFINITY,
  },
];

export default function GalleryPage() {
  const getPrimaryImageSrc = (product: Producto): string => {
    return product.image && product.image.length > 0
      ? product.image[0]
      : "/placeholder.svg?height=400&width=400";
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
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Producto[]>([]);
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

  // Función para obtener productos similares
  const getSimilarProducts = (product: Producto) => {
    const similar = products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
    setSimilarProducts(similar);
  };

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

    // Filtrar por rango de precio
    const selectedPriceRange = priceRanges.find(
      (range) => range.id === priceRange
    );
    if (selectedPriceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPriceRange.min &&
          product.price <= selectedPriceRange.max
      );
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
    getSimilarProducts(filteredProducts[newIndex]);
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
      <>
        <main>
          <div className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="text-stone-300 mr-3" size={32} />
                  <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide">
                    Galería de Productos
                  </h1>
                  <Sparkles className="text-stone-300 ml-3" size={32} />
                </div>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300 font-light leading-relaxed">
                  Explora nuestra colección completa de joyería artesanal, cada
                  pieza creada con pasión y dedicación en Uruguay.
                </p>
              </motion.div>
            </div>
          </div>
          <section className="py-20 bg-gradient-to-br from-stone-50 to-stone-100">
            <div className="container mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Loader2 className="animate-spin text-stone-600" size={32} />
              </div>
              <p className="text-lg text-stone-600 font-light">
                Cargando productos...
              </p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main>
        {/* Banner de la galería */}
        <div className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="text-stone-300 mr-3" size={32} />
                <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide">
                  Galería de Productos
                </h1>
                <Sparkles className="text-stone-300 ml-3" size={32} />
              </div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300 font-light leading-relaxed">
                Explora nuestra colección completa de joyería artesanal, cada
                pieza creada con pasión y dedicación en Uruguay.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contenido principal */}
        <section className="py-12 bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar de filtros */}
              <div className="lg:w-80 space-y-6">
                {/* Buscador */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <div className="p-4">
                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                        size={20}
                      />
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-12 h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500 bg-white"
                      />
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Filtros móviles */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full h-12 border-stone-300 hover:bg-stone-50 bg-white shadow-sm"
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
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <div className="p-4">
                      <h3 className="font-semibold mb-4 text-stone-800 flex items-center">
                        <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center mr-3">
                          <SlidersHorizontal className="text-white" size={16} />
                        </div>
                        Categorías
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() =>
                              setSelectedCategory(
                                category.id as ProductCategory
                              )
                            }
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
                              selectedCategory === category.id
                                ? "bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-md"
                                : "hover:bg-stone-50 text-stone-700 border border-stone-200"
                            }`}
                          >
                            <span className="font-medium">{category.name}</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                selectedCategory === category.id
                                  ? "bg-white text-stone-800"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {category.count}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Rango de precios */}
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <div className="p-4">
                      <h3 className="font-semibold mb-4 text-stone-800 flex items-center">
                        <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center mr-3">
                          <DollarSign className="text-white" size={16} />
                        </div>
                        Precio
                      </h3>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range.id}
                            onClick={() => setPriceRange(range.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              priceRange === range.id
                                ? "bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-md"
                                : "hover:bg-stone-50 text-stone-700 border border-stone-200"
                            }`}
                          >
                            <span className="font-medium">{range.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Materiales */}
                  {allMaterials.length > 0 && (
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <div className="p-4">
                        <h3 className="font-semibold mb-4 text-stone-800 flex items-center">
                          <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center mr-3">
                            <Gem className="text-white" size={16} />
                          </div>
                          Materiales
                        </h3>
                        <div className="space-y-2">
                          {allMaterials.map((material) => (
                            <label
                              key={material}
                              className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-stone-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedMaterials.includes(material)}
                                onChange={() => toggleMaterial(material)}
                                className="rounded border-stone-300 text-stone-800 focus:ring-stone-500"
                              />
                              <span className="text-sm font-medium text-stone-700">
                                {material}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* Contenido principal */}
              <div className="flex-1">
                {/* Header con ordenamiento */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-stone-200">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif mb-2 text-stone-800">
                      {isSearching
                        ? `Resultados para "${searchTerm}"`
                        : "Todos los productos"}
                    </h2>
                    <p className="text-stone-600 flex items-center">
                      <Package className="mr-2" size={16} />
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "producto" : "productos"}
                      {selectedCategory !== "todos" &&
                        ` en ${selectedCategory}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <span className="text-sm text-stone-600 font-medium">
                      Ordenar por:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 bg-white shadow-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid de productos mejorado estilo e-commerce */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${sortBy}-${priceRange}-${selectedMaterials.join(
                      ","
                    )}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg h-full flex flex-col gap-0 !p-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                className="cursor-pointer relative"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  getSimilarProducts(product);
                                }}
                              >
                                <div className="relative aspect-square overflow-hidden bg-stone-50">
                                  <img
                                    src={
                                      getPrimaryImageSrc(product) ||
                                      "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />

                                  {/* Badge de categoría */}
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-white/90 text-stone-800 text-xs font-medium">
                                      {product.category}
                                    </Badge>
                                  </div>

                                  {/* Overlay con acciones */}
                                  <div
                                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
                                      hoveredProduct === product.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  >
                                    <div className="absolute bottom-4 left-4 right-4">
                                      <Button
                                        size="sm"
                                        className="w-full bg-white/95 hover:bg-white text-stone-800 shadow-lg hover:shadow-xl transition-all font-medium"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(product);
                                        }}
                                      >
                                        <ShoppingCart
                                          size={14}
                                          className="mr-2"
                                        />
                                        Añadir al Carrito
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>

                            {/* Modal mejorado */}
                            <DialogContent className="sm:max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-3xl font-serif text-stone-800">
                                  {selectedProduct?.name}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                {/* SECCIÓN DE IMÁGENES */}
                                <div className="relative">
                                  {selectedProduct?.image &&
                                  selectedProduct.image.length > 0 ? (
                                    <Carousel className="w-full">
                                      <CarouselContent>
                                        {selectedProduct.image.map(
                                          (url, index) => (
                                            <CarouselItem key={index}>
                                              <div className="relative w-full h-96 bg-stone-50 overflow-hidden rounded-xl">
                                                <img
                                                  src={
                                                    url || "/placeholder.svg"
                                                  }
                                                  alt={`${
                                                    selectedProduct.name
                                                  } - Imagen ${index + 1}`}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </CarouselItem>
                                          )
                                        )}
                                      </CarouselContent>
                                      {selectedProduct.image.length > 1 && (
                                        <>
                                          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-stone-200 shadow-lg" />
                                          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-stone-200 shadow-lg" />
                                        </>
                                      )}
                                    </Carousel>
                                  ) : (
                                    <div className="w-full h-96 bg-stone-50 flex items-center justify-center rounded-xl">
                                      <img
                                        src="/placeholder.svg?height=400&width=400"
                                        alt="Imagen no disponible"
                                        className="w-full h-full object-cover rounded-xl"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* SECCIÓN DE INFORMACIÓN DEL PRODUCTO */}
                                <div className="flex flex-col justify-start space-y-6">
                                  <DialogDescription className="text-base text-stone-600 leading-relaxed">
                                    {selectedProduct?.description}
                                  </DialogDescription>

                                  {selectedProduct?.materials &&
                                    selectedProduct.materials.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-stone-500 mb-3 uppercase tracking-wide">
                                          Materiales
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedProduct.materials.map(
                                            (material, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="outline"
                                                className="bg-stone-50 border-stone-300"
                                              >
                                                {material}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  <div>
                                    <h4 className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                                      Precio
                                    </h4>
                                    <p className="text-4xl font-serif text-stone-800">
                                      {selectedProduct &&
                                        formatPrice(selectedProduct.price)}
                                    </p>
                                  </div>

                                  <div className="flex gap-4">
                                    <Button
                                      className="flex-1 bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-white h-12 shadow-lg hover:shadow-xl transition-all"
                                      onClick={() =>
                                        selectedProduct &&
                                        handleAddToCart(selectedProduct)
                                      }
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

                              {/* Productos similares */}
                              {similarProducts.length > 0 && (
                                <div className="mt-8 border-t pt-8">
                                  <h3 className="text-xl font-serif text-stone-800 mb-4">
                                    Productos Similares
                                  </h3>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {similarProducts.map((similar) => (
                                      <div
                                        key={similar.id}
                                        className="cursor-pointer group"
                                        onClick={() => {
                                          setSelectedProduct(similar);
                                          getSimilarProducts(similar);
                                        }}
                                      >
                                        <div className="relative aspect-square bg-stone-50 rounded-lg overflow-hidden mb-2">
                                          <img
                                            src={
                                              getPrimaryImageSrc(similar) ||
                                              "/placeholder.svg"
                                            }
                                            alt={similar.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          />
                                        </div>
                                        <h4 className="text-sm font-medium text-stone-800 line-clamp-2">
                                          {similar.name}
                                        </h4>
                                        <p className="text-sm font-serif text-stone-600">
                                          {formatPrice(similar.price)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between mt-8">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigateProduct("prev")}
                                  className="hover:bg-stone-50 rounded-full"
                                >
                                  <ChevronLeft size={24} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigateProduct("next")}
                                  className="hover:bg-stone-50 rounded-full"
                                >
                                  <ChevronRight size={24} />
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-stone-800 mb-2 line-clamp-2">
                                {product.name}
                              </h3>

                              {product.popularity && (
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={
                                          i < Math.floor(product.popularity!)
                                            ? "text-yellow-400 fill-current"
                                            : "text-stone-200"
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-stone-500">
                                    ({product.popularity})
                                  </span>
                                </div>
                              )}

                              {product.materials &&
                                product.materials.length > 0 && (
                                  <div className="mb-3">
                                    <div className="flex flex-wrap gap-1">
                                      {product.materials
                                        .slice(0, 2)
                                        .map((material, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-xs bg-stone-50 border-stone-200"
                                          >
                                            {material}
                                          </Badge>
                                        ))}
                                      {product.materials.length > 2 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-stone-50 border-stone-200"
                                        >
                                          +{product.materials.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xl font-serif text-stone-800">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredProducts.length === 0 && !loading && (
                  <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="text-stone-400" size={32} />
                    </div>
                    <p className="text-lg text-stone-600 mb-6">
                      No se encontraron productos que coincidan con tus filtros.
                    </p>
                    <Button
                      variant="outline"
                      className="border-stone-300 hover:border-stone-500 hover:bg-stone-50 shadow-sm hover:shadow-md transition-all bg-transparent"
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
        <section className="bg-gradient-to-r from-stone-800 to-stone-700 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-8 text-stone-300 leading-relaxed">
                Podemos crear una pieza personalizada especialmente para ti.
                Contáctanos para discutir tus ideas y convertirlas en una joya
                única.
              </p>
              <Button
                asChild
                className="bg-white text-stone-800 hover:bg-stone-100 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/contacto">
                  <Sparkles className="mr-2" size={20} />
                  Solicitar Diseño Personalizado
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
