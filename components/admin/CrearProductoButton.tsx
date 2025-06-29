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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Producto } from "@/app/admin/products/page";
import ImageUploader from "./SubirImagen";
import { Checkbox } from "../ui/checkbox";

interface CrearOEditarProductoDialogProps {
  open?: boolean;
  products: Producto[];
  onProductsChange?: (products: Producto[]) => void;
  onOpenChange?: (open: boolean) => void;
  productoInicial?: Producto | null;
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
  const [stock, setStock] = useState("");
  const [publicado, setPublicado] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open && productoInicial) {
      setNombre(productoInicial.name);
      setPrecio(productoInicial.price.toString());
      setDescripcion(productoInicial.description || "");
      setCategoria(productoInicial.category);
      setStock(productoInicial.stock?.toString() || "");
      setPublicado(productoInicial.is_posted);
      setImagenUrls(productoInicial.image || []);
    } else if (!open) {
      resetearFormulario();
    }
  }, [open, productoInicial]);

  const resetearFormulario = () => {
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setCategoria("");
    setImagenUrls([]);
    setStock("");
    setPublicado(true);
    setFormError(null);
  };

  const handleImagenSubida = (urls: string[]) => {
    setImagenUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSubmitting) return;

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
    if (isNaN(Number(stock)) || Number.parseInt(stock, 10) < 0) {
      setFormError(
        "El stock debe ser un número entero válido mayor o igual a 0."
      );
      return;
    }

    setIsSubmitting(true);

    const productoPayload = {
      name: nombre,
      price: Number(precio),
      description: descripcion,
      category: categoria,
      image: imagenUrls,
      stock: Number.parseInt(stock, 10),
      is_posted: publicado,
      popularity: productoInicial?.popularity || 0,
      materials: productoInicial?.materials || [],
    };

    const method = productoInicial ? "PATCH" : "POST";
    const url = productoInicial
      ? `/api/products/${productoInicial.id}`
      : "/api/products/create";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoPayload),
      });

      if (!response.ok) {
        let errorMessage = `Error al ${
          productoInicial ? "actualizar" : "crear"
        } el producto: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: Producto = await response.json();

      if (onProductsChange) {
        if (productoInicial) {
          onProductsChange(products.map((p) => (p.id === data.id ? data : p)));
        } else {
          onProductsChange([...products, data]);
        }
      }

      if (onOpenChange) {
        onOpenChange(false);
      }
      resetearFormulario();
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
              placeholder="0"
              min="0"
              step="1"
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
                <SelectItem value="colgantes">Colgantes</SelectItem>
                <SelectItem value="pulseras">Pulseras</SelectItem>
                <SelectItem value="anillos">Anillos</SelectItem>
                <SelectItem value="caravanas">Caravanas</SelectItem>
                <SelectItem value="marcalibros">Marcalibros</SelectItem>
                <SelectItem value="prendedores">Prendedores</SelectItem>
                <SelectItem value="llaveros">Llaveros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagen">Imagen</Label>
            <ImageUploader onUpload={handleImagenSubida} />
            {imagenUrls.length > 0 && (
              <div className="mt-2">
                <Carousel className="w-full max-w-xs mx-auto">
                  {" "}
                  {/* Ajusta el ancho según necesites */}
                  <CarouselContent>
                    {imagenUrls.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="relative w-full h-40 border rounded-md overflow-hidden">
                            <img
                              src={url}
                              alt={`Vista previa del producto ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {imagenUrls.length > 1 && ( // Muestra las flechas solo si hay más de una imagen
                    <>
                      <CarouselPrevious type="button" />
                      <CarouselNext type="button" />
                    </>
                  )}
                </Carousel>
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
