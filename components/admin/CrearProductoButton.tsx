// components/admin/CrearOEditarProductoDialog.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Producto } from "@/app/admin/products/page"; // Importa la interfaz Producto
import ImageUploader from "./SubirImagen"; // Importa tu componente SubirImagen
import { Checkbox } from "../ui/checkbox";

interface CrearOEditarProductoDialogProps {
  open?: boolean;
  products: Producto[];
  onProductsChange?: (products: Producto[]) => void;
  onOpenChange?: (open: boolean) => void;
  productoInicial?: Producto | null; // El producto que se va a editar (o null para crear)
}

export default function CrearOEditarProductoDialog({
  open,
  products,
  onProductsChange,
  onOpenChange,
  productoInicial,
}: CrearOEditarProductoDialogProps) {
  const [imagenUrls, setImagenUrls] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("0");
  const [publicado, setPublicado] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para el envío del formulario principal
  const [formError, setFormError] = useState<string | null>(null);

  // Efecto para inicializar el formulario cuando se abre o cambia el producto inicial
  useEffect(() => {
    if (open && productoInicial) {
      setNombre(productoInicial.name);
      setPrecio(productoInicial.price.toString());
      setDescripcion(productoInicial.description || "");
      setCategoria(productoInicial.category);
      setStock(productoInicial.stock?.toString() || "0");
      setPublicado(productoInicial.is_posted);
      setImagenUrls(productoInicial.image ? productoInicial.image : []); // Carga la URL de imagen existente
    } else if (!open) {
      // Si el diálogo se cierra, resetea el formulario
      resetearFormulario();
    }
  }, [open, productoInicial]);

  const resetearFormulario = () => {
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setCategoria("");
    setImagenUrls([]); // Importante: Resetear la URL de la imagen
    setStock("0");
    setPublicado(true);
    setFormError(null);
  };

  // Esta función es llamada por el componente ImageUploader cuando una imagen se sube con éxito
  const handleImagenSubida = (urls: string[]) => {
    setImagenUrls(urls);
  };
  const handleRemoveImage = (urlToRemove: string) => {
    setImagenUrls((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSubmitting) return; // Evitar múltiples envíos si ya está en curso

    // Validaciones del formulario
    if (!nombre || !precio || !descripcion || !categoria || !stock) {
      setFormError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    if (!imagenUrls.length) {
      setFormError("Por favor, sube una imagen para el producto.");
      return;
    }
    if (isNaN(Number(precio)) || Number(precio) < 0) {
      setFormError("El precio debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (isNaN(Number(stock)) || Number(Number.parseInt(stock, 10)) < 0) {
      setFormError(
        "El stock debe ser un número entero válido mayor o igual a 0."
      );
      return;
    }

    setIsSubmitting(true);

    // Los datos a enviar al backend
    const productoPayload = {
      name: nombre,
      price: Number(precio),
      description: descripcion,
      category: categoria,
      image: imagenUrls,
      stock: Number.parseInt(stock, 10),
      is_posted: publicado,
      popularity: productoInicial?.popularity || 0, // Mantener si existe, o 0 si es nuevo
      materials: productoInicial?.materials || [], // Mantener si existe, o [] si es nuevo
    };

    // Determinar el método HTTP y la URL según si estamos editando o creando
    const method = productoInicial ? "PATCH" : "POST";
    const url = productoInicial
      ? `/api/products/${productoInicial.id}` // Para editar, usa la URL con el ID
      : "/api/products/create"; // Para crear

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoPayload),
      });

      const responseText = await response.text();
      let responseData: any;
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          responseData = {}; // Empty response
        }
      } catch (jsonParseError) {
        responseData = { message: responseText };
      }

      if (!response.ok) {
        let errorMessage = `Error al ${
          productoInicial ? "actualizar" : "crear"
        } el producto: ${response.statusText}`;
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (
          typeof responseData === "string" &&
          responseData.startsWith("<!DOCTYPE html>")
        ) {
          errorMessage =
            "Error del servidor (respuesta HTML inesperada). Verifica la consola del navegador y el servidor.";
        } else if (typeof responseData === "string") {
          errorMessage = responseData; // If it's just raw text
        }
        throw new Error(errorMessage);
      }

      const data = responseData; // El producto recién creado o actualizado

      // Actualizar la lista de productos en el componente padre
      if (onProductsChange) {
        if (productoInicial) {
          // Si estamos editando, reemplazamos el producto antiguo por el nuevo actualizado
          onProductsChange(products.map((p) => (p.id === data.id ? data : p)));
        } else {
          // Si estamos creando, añadimos el nuevo producto a la lista
          onProductsChange([...products, data]);
        }
      }

      // Cerrar el diálogo después de una operación exitosa
      if (onOpenChange) {
        onOpenChange(false);
      }
      resetearFormulario(); // Resetear el formulario para la próxima vez
    } catch (error) {
      console.error(
        `Error al ${productoInicial ? "actualizar" : "crear"} el producto:`,
        error
      );
      setFormError(`Hubo un error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Scrollbar: Añadimos max-h-[90vh] para limitar la altura y overflow-y-auto para el scroll */}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {productoInicial ? "Editar Producto" : "Crear Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {productoInicial
              ? "Modifica los detalles del producto existente."
              : "Completa los detalles del nuevo producto para agregarlo al catálogo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="precio">Precio (UYU)</Label>
            <Input
              id="precio"
              name="precio"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock">Cantidad en Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción detallada del producto"
              className="min-h-[100px]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select
              name="categoria"
              value={categoria}
              onValueChange={setCategoria}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collares">Collares</SelectItem>
                <SelectItem value="pulseras">Pulseras</SelectItem>
                <SelectItem value="anillos">Anillos</SelectItem>
                <SelectItem value="caravanas">Caravanas</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagen">Imagen</Label>
            {/* El componente ImageUploader encapsula la lógica del botón y la subida */}
            <ImageUploader onUpload={handleImagenSubida} />
            {imagenUrls.length > 0 && (
              <div className="relative w-full h-40 border rounded-md overflow-hidden mt-2">
                <img
                  src={imagenUrls[0]}
                  alt="Vista previa del producto"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="publicado">Publicado</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="publicado"
                checked={publicado}
                onCheckedChange={(checked) => setPublicado(Boolean(checked))}
              />
              <label
                htmlFor="publicado"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ¿Producto publicado en la tienda?
              </label>
            </div>
          </div>
          {formError && (
            <p className="text-red-500 text-sm mt-2">{formError}</p>
          )}
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !imagenUrls.length}>
              {isSubmitting
                ? productoInicial
                  ? "Guardando Cambios..."
                  : "Creando Producto..."
                : productoInicial
                ? "Guardar Cambios"
                : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
