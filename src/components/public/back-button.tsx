"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Volver"
      className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center
                 justify-center rounded-full bg-white/60 border border-white
                 backdrop-blur-sm"
    >
      <ChevronLeft size={22} />
    </button>
  ); 
}