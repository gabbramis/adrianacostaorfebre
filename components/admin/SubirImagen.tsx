// components/SubirImagen.tsx
"use client";

import { useState, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
}

export default function ImageUploader({
  onUpload,
  currentImages = [],
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setUploadErrorMessage("No se seleccionó ningún archivo.");
      return;
    }

    setLoading(true);
    setUploadErrorMessage(null);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `foto-productos/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error de Supabase al subir:", uploadError);
          setUploadErrorMessage(
            `Error al subir ${file.name}: ${
              uploadError.message || uploadError.name || "Desconocido"
            }`
          );
          setLoading(false); // Detener la carga en el primer error
          return; // Salir si hay un error en cualquier archivo
        }

        const { data: publicUrlData } = await supabase.storage
          .from("imagenes")
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          console.error(
            "No se pudo obtener la URL pública de Supabase para:",
            file.name
          );
          setUploadErrorMessage(
            `Error: No se pudo obtener la URL pública para ${file.name}.`
          );
          setLoading(false); // Detener la carga
          return; // Salir
        }

        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (error) {
        console.error("Error inesperado durante la subida de imagen:", error);
        setUploadErrorMessage(
          `Error inesperado al subir ${file.name}: ${(error as Error).message}`
        );
        setLoading(false);
        return;
      }
    }

    onUpload([...currentImages, ...uploadedUrls]);

    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpiar el input
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
        className="hidden"
        disabled={loading}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Seleccionar Imagen(es)"}
      </Button>

      {uploadErrorMessage && (
        <p className="text-red-500 text-sm">{uploadErrorMessage}</p>
      )}
    </div>
  );
}
