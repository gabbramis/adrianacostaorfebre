// components/SubirImagen.tsx (o ImageUploader.tsx)
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null
  ); // Nuevo estado para el mensaje de error

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadErrorMessage(null); // Limpiar errores previos

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `foto-productos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("imagenes")
      .upload(filePath, file);

    if (uploadError) {
      // Muestra el error específico de Supabase
      console.error("Error de Supabase al subir:", uploadError);
      setUploadErrorMessage(
        `Error al subir: ${
          uploadError.message || uploadError.name || "Desconocido"
        }`
      );
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = await supabase.storage
      .from("imagenes")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error("No se pudo obtener la URL pública");
      setUploadErrorMessage("Error: No se pudo obtener la URL pública.");
    } else {
      setImageUrl(publicUrlData.publicUrl);
      if (onUpload) {
        onUpload(publicUrlData.publicUrl);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded w-fit space-y-2">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Subiendo imagen...</p>}
      {uploadErrorMessage && (
        <p className="text-red-500">{uploadErrorMessage}</p>
      )}{" "}
      {/* Muestra el error */}
      {imageUrl && (
        <div>
          <p>Imagen subida:</p>
          <img
            src={imageUrl}
            alt="uploaded"
            className="w-32 h-32 object-cover"
          />
        </div>
      )}
    </div>
  );
}
