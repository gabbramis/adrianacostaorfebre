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
  image?: string;
  stock?: number;
  materials?: string[];
  popularity?: number;
  createdAt?: string;
}

export default function Home() {
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
      setProductos(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []); // Cargar productos al montar el componente

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el producto: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Si la eliminación fue exitosa (código 204 No Content), no hay cuerpo JSON
      // Actualizar el estado local para reflejar el cambio
      setProductos((prevProducts) => prevProducts.filter((p) => p.id !== id));
      alert(`"${productName}" eliminado correctamente.`);
    } catch (error) {
      console.error("Fallo la eliminación:", error);
      alert(`No se pudo eliminar el producto: ${(error as Error).message}`);
    }
  };

  // Función para manejar el clic en "Editar"
  const handleEditClick = (producto: Producto) => {
    setProductoParaEditar(producto); // Establece el producto que se va a editar
    setDialogoAbierto(true); // Abre el diálogo
  };

  // Función que se pasa al diálogo para que actualice la lista de productos
  const handleProductsChange = (updatedProducts: Producto[]) => {
    setProductos(updatedProducts); // Actualiza la lista completa de productos
    // Opcional: si la edición/creación es exitosa, podrías recargar para asegurar consistencia
    // cargarProductos();
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Administración de Productos</h1>
        <Button
          onClick={() => {
            setProductoParaEditar(null); // Para asegurar que se abre en modo "Crear"
            setDialogoAbierto(true);
          }}
        >
          Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          Aquí se mostrarán los productos existentes
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <Card key={producto.id}>
              <CardContent className="p-4">
                <div className="aspect-square w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                  {producto.image ? (
                    <img
                      src={producto.image}
                      alt={producto.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-center text-gray-500">No hay imagen</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{producto.name}</h3>
                  <Badge
                    variant={
                      producto.stock && producto.stock > 0
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {producto.stock && producto.stock > 0
                      ? `Stock: ${producto.stock}`
                      : "Sin stock"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {producto.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">${producto.price}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {producto.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(producto)} // Llama a la nueva función
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
          ))}
        </div>
      )}

      {/* El diálogo de Crear/Editar Producto */}
      <CrearProductoButton
        open={dialogoAbierto}
        products={productos}
        onProductsChange={handleProductsChange}
        onOpenChange={setDialogoAbierto}
        productoInicial={productoParaEditar} // Pasa el producto a editar
      />
    </main>
  );
}
