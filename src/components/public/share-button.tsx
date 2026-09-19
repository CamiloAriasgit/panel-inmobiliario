"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({
  title,
  slug,
  variant = "button",
}: {
  title: string;
  slug: string;
  variant?: "button" | "icon";
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/propiedades/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // El usuario cerró el panel de compartir sin elegir nada.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label="Compartir"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center
                   justify-center rounded-full bg-white/60 border border-white
                   backdrop-blur-sm"
      >
        {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-full
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