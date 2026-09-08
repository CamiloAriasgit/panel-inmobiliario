"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/propiedades/${slug}`;

    // Si el navegador soporta la Web Share API nativa (la mayoría de
    // móviles), se usa el panel de compartir del sistema operativo
    // (WhatsApp, Instagram, correo, etc. ya integrados).
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // El usuario cerró el panel de compartir sin elegir nada;
        // no es un error real, no se hace nada.
      }
      return;
    }

    // Fallback para navegadores de escritorio sin Web Share API:
    // copiar el enlace al portapapeles.
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-lg
                 border border-gray-300 py-2.5 text-sm font-medium text-gray-700
                 hover:bg-gray-50"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-600" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 size={16} />
          Compartir
        </>
      )}
    </button>
  );
}