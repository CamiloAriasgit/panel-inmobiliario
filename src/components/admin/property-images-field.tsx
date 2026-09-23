"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Check, Trash2 } from "lucide-react";
import { uploadPropertyImage } from "@/lib/utils/upload-image";

export function PropertyImagesField({
  images,
  onChange,
  agencyId,
  propertyId,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  agencyId: string;
  propertyId: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadPropertyImage(file, agencyId, propertyId))
      );
      onChange([...images, ...uploadedUrls]);
    } catch {
      setError("No se pudieron subir una o más imágenes.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function toggleSelectionMode() {
    setSelectionMode((prev) => !prev);
    setSelected(new Set());
  }

  function toggleSelected(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  }

  function deleteSelected() {
    onChange(images.filter((image) => !selected.has(image)));
    setSelected(new Set());
    setSelectionMode(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutral-900">Imágenes</h2>
        {images.length > 0 && (
          <button
            type="button"
            onClick={toggleSelectionMode}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            {selectionMode ? "Cancelar" : "Seleccionar"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image) => {
          const isSelected = selected.has(image);

          return (
            <div key={image} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image src={image} alt="" fill className="object-cover" />

              {selectionMode ? (
                // Modo selección: toda la miniatura es el botón, con un
                // check que se llena al tocarla. Pensado para mobile,
                // pero funciona igual en desktop.
                <button
                  type="button"
                  onClick={() => toggleSelected(image)}
                  aria-label={isSelected ? "Deseleccionar imagen" : "Seleccionar imagen"}
                  className={`absolute inset-0 flex items-start justify-end p-2 transition ${
                    isSelected ? "bg-black/30" : "bg-black/0"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${
                      isSelected ? "bg-[var(--color-primary)]" : "bg-black/20"
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </span>
                </button>
              ) : (
                // Fuera del modo selección: borrado rápido individual con
                // hover — solo tiene sentido con mouse, por eso en mobile
                // (sin hover) la alternativa real es el botón "Seleccionar".
                <button
                  type="button"
                  onClick={() => onChange(images.filter((item) => item !== image))}
                  aria-label="Eliminar imagen"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center
                             justify-center rounded-full bg-black/60 text-white
                             opacity-0 transition group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || selectionMode}
          className="flex aspect-square flex-col items-center justify-center gap-1
                     rounded-xl border-2 border-dashed border-gray-300 text-neutral-400
                     hover:border-gray-400 disabled:opacity-40"
        >
          <Upload size={20} />
          <span className="text-xs">{isUploading ? "Subiendo..." : "Agregar"}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {selectionMode && selected.size > 0 && (
        <button
          type="button"
          onClick={deleteSelected}
          className="flex w-full items-center justify-center gap-2 rounded-xl
                     bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <Trash2 size={16} />
          Eliminar {selected.size} {selected.size === 1 ? "imagen" : "imágenes"}
        </button>
      )}
    </div>
  );
}