// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import CrearProductoButton from "@/components/admin/CrearProductoButton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSupabaseClient } from "@/utils/supabase/client";

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

      // Si la eliminación fue exitosa (código 204 No Content), no hay cuerpo JSON
      // Actualizar el estado local para reflejar el cambio
      setProductos((prevProducts) => prevProducts.filter((p) => p.id !== id));
      alert(`"${productName}" eliminado correctamente.`);
    } catch (error) {
      console.error("Falló la eliminación:", error);
      alert(`No se pudo eliminar el producto: ${(error as Error).message}`);
    }
  };

  // Función para manejar el clic en "Editar" (abre el diálogo en modo edición)
  const handleEditClick = (producto: Producto) => {
    setProductoParaEditar(producto); // Establece el producto que se va a editar
    setDialogoAbierto(true); // Abre el diálogo
  };

  // Función para manejar el clic en "Crear Producto" (abre el diálogo en modo creación)
  const handleCreateClick = () => {
    setProductoParaEditar(null); // Asegura que el diálogo se abra en modo "Crear"
    setDialogoAbierto(true);
  };

  // Función que se pasa al diálogo para que actualice la lista de productos
  const handleProductsChange = (updatedProducts: Producto[]) => {
    setProductos(updatedProducts); // Actualiza la lista completa de productos
    // Opcional: podrías recargar los productos de la base de datos para asegurar consistencia,
    // pero actualizar el estado local directamente es más rápido.
    // cargarProductos();
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Control de inventario
        </h1>
        <Button onClick={handleCreateClick}>
          {" "}
          {/* Usar la nueva función */}
          Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-10">
          Cargando productos...
        </div>
      ) : productos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
          <p>Aún no hay productos registrados.</p>
          <p className="mt-2">¡Haz clic en Crear Producto para empezar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {/* Espaciado ajustado */}
          {productos.map((producto) => {
            // Determinar la imagen principal para la tarjeta
            const primaryImageSrc =
              producto.image && producto.image.length > 0
                ? producto.image[0]
                : "/placeholder-product.png"; // Ruta a tu imagen de placeholder

            return (
              <Card key={producto.id} className="flex flex-col h-full">
                {" "}
                {/* Asegurar altura completa de la tarjeta */}
                <CardContent className="p-4 flex-grow">
                  {" "}
                  {/* flex-grow para que ocupe espacio disponible */}
                  <div className="aspect-square w-full mb-4 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={primaryImageSrc}
                      alt={producto.name}
                      className="w-full h-full object-contain" // object-contain para que la imagen completa sea visible
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight pr-2">
                      {producto.name}
                    </h3>{" "}
                    {/* Ajustes de texto */}
                    <Badge
                      variant={
                        producto.stock && producto.stock > 0
                          ? "outline"
                          : "destructive"
                      }
                      className="whitespace-nowrap" // Evitar que el texto de la insignia se rompa
                    >
                      {producto.stock && producto.stock > 0
                        ? `Stock: ${producto.stock}`
                        : "Sin stock"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {producto.description || "Sin descripción."}{" "}
                    {/* Fallback para descripción */}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    {" "}
                    {/* mt-auto empuja al final si hay espacio */}
                    <span className="font-bold text-lg">
                      ${producto.price.toFixed(2)}
                    </span>{" "}
                    {/* Formato de precio */}
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {producto.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t mt-4">
                  {" "}
                  {/* Separador visual */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(producto)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(producto.id, producto.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* El diálogo de Crear/Editar Producto */}
      <CrearProductoButton
        open={dialogoAbierto}
        products={productos}
        onProductsChange={handleProductsChange}
        onOpenChange={setDialogoAbierto}
        productoInicial={productoParaEditar}
      />
    </main>
  );
}
