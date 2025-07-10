"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Edit,
  Package,
  Eye,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";
import CrearProductoButton from "@/components/admin/CrearProductoButton";

export interface Producto {
  id: string;
  name: string;
  price: number;
  is_posted: boolean;
  category: string;
  description?: string;
  image?: string[];
  stock?: number;
  materials?: string[];
  popularity?: number;
  created_at?: string;
}

export default function AdminProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoParaEditar, setProductoParaEditar] = useState<Producto | null>(
    null
  );
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cargarProductos = async () => {
    setIsLoading(true);
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Error al cargar productos:", error);
    } else {
      setProductos(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id: string, productName: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${productName}"? Esta acción es irreversible.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el producto: ${response.statusText}`;
        const responseData = await response.text();
        try {
          const errorJson = JSON.parse(responseData);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = responseData || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setProductos((prevProducts) => prevProducts.filter((p) => p.id !== id));
      alert(`"${productName}" eliminado correctamente.`);
    } catch (error) {
      console.error("Falló la eliminación:", error);
      alert(`No se pudo eliminar el producto: ${(error as Error).message}`);
    }
  };

  const handleEditClick = (producto: Producto) => {
    setProductoParaEditar(producto);
    setDialogoAbierto(true);
  };

  const handleCreateClick = () => {
    setProductoParaEditar(null);
    setDialogoAbierto(true);
  };

  const handleProductsChange = (updatedProducts: Producto[]) => {
    setProductos(updatedProducts);
  };

  const categories = [
    ...new Set(productos.map((p) => p.category).filter(Boolean)),
  ];

  const getProductStatus = (product: Producto) => {
    const stock = product.stock || 0;
    if (stock === 0) return "out_of_stock";
    if (stock <= 5) return "low_stock";
    return "in_stock";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      out_of_stock: {
        label: "Sin Stock",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      low_stock: {
        label: "Stock Bajo",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      in_stock: {
        label: "En Stock",
        color: "bg-green-100 text-green-800 border-green-200",
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock
    );
  };

  const filteredProducts = productos.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ProductDetailDialog = ({ product }: { product: Producto }) => {
    const primaryImageSrc =
      product.image && product.image.length > 0
        ? product.image[0]
        : "/placeholder.svg?height=200&width=200";
    const productStatus = getProductStatus(product);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>
              Información completa del inventario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src={primaryImageSrc || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">
                  {product.category} • ID: {product.id}
                </p>
                <Badge
                  className={`mt-2 ${getStatusBadge(productStatus).color}`}
                >
                  {getStatusBadge(productStatus).label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Actual:</span>
                    <span className="font-semibold">
                      {product.stock || 0} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span
                      className={
                        product.is_posted ? "text-green-600" : "text-gray-600"
                      }
                    >
                      {product.is_posted ? "Publicado" : "No publicado"}
                    </span>
                  </div>
                  {product.materials && product.materials.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materiales:</span>
                      <span>{product.materials.join(", ")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información Financiera
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio de Venta:</span>
                    <span className="font-semibold">${product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor en Stock:</span>
                    <span className="font-semibold">
                      ${((product.stock || 0) * product.price).toFixed(2)}
                    </span>
                  </div>
                  {product.popularity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Popularidad:</span>
                      <span>{product.popularity}/10</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900">{product.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => handleEditClick(product)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Producto
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(product.id, product.name)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ProductCard = ({ product }: { product: Producto }) => {
    const primaryImageSrc =
      product.image && product.image.length > 0
        ? product.image[0]
        : "/placeholder-product.png";
    const productStatus = getProductStatus(product);

    return (
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4 flex-grow">
          <div className="aspect-square w-full mb-4 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={primaryImageSrc}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight pr-2">
              {product.name}
            </h3>
            <Badge
              className={`whitespace-nowrap ${
                getStatusBadge(productStatus).color
              }`}
            >
              {product.stock && product.stock > 0
                ? `Stock: ${product.stock}`
                : "Sin stock"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {product.description || "Sin descripción."}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {product.category}
            </span>
          </div>
        </CardContent>
        <div className="p-4 pt-0 flex justify-between gap-2 border-t">
          <div className="flex gap-2">
            <ProductDetailDialog product={product} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(product.id, product.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant={product.is_posted ? "default" : "secondary"}>
            {product.is_posted ? "Publicado" : "No publicado"}
          </Badge>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando productos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Control de inventario
              </h1>
              <p className="text-gray-600 mt-2">
                Administra tu inventario y catálogo de productos
              </p>
            </div>
            <Button
              onClick={handleCreateClick}
              className="bg-black hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Producto
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay productos
                </h3>
                <p className="text-gray-600 mb-6">
                  {productos.length === 0
                    ? "Aún no hay productos registrados."
                    : "No se encontraron productos con los filtros aplicados."}
                </p>
                <p className="text-gray-500 mb-4">
                  ¡Haz clic en Crear Producto para empezar!
                </p>
                <Button
                  onClick={handleCreateClick}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Producto
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lista de Productos</h3>
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} productos encontrados
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Valor Stock</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const primaryImageSrc =
                        product.image && product.image.length > 0
                          ? product.image[0]
                          : "/placeholder-product.png";
                      const productStatus = getProductStatus(product);

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  primaryImageSrc || "/placeholder-product.png"
                                }
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded border"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">
                                  {product.is_posted
                                    ? "Publicado"
                                    : "No publicado"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.category || "Sin categoría"}
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-semibold">
                                {product.stock || 0}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusBadge(productStatus).color}
                            >
                              {getStatusBadge(productStatus).label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${product.price}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${((product.stock || 0) * product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <ProductDetailDialog product={product} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDelete(product.id, product.name)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CrearProductoButton Dialog */}
        <CrearProductoButton
          open={dialogoAbierto}
          products={productos}
          onProductsChange={handleProductsChange}
          onOpenChange={setDialogoAbierto}
          productoInicial={productoParaEditar}
        />
      </div>
    </div>
  );
}
