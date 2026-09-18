"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({
  images,
  title,
  showArrows = false,
  aspectClassName = "aspect-square",
}: {
  images: string[];
  title: string;
  showArrows?: boolean;
  aspectClassName?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const newIndex = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(newIndex);
  }

  function goToImage(index: number) {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === images.length - 1;

  return (
    <div className="relative">
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={`flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide lg:rounded-xl ${aspectClassName}`}
        >
          {images.map((image, index) => (
            <div
              key={image + index}
              className={`relative w-full flex-shrink-0 snap-center ${aspectClassName}`}
            >
              <Image
                src={image}
                alt={`${title} - foto ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {showArrows && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToImage(activeIndex - 1)}
              disabled={isFirst}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2
                         items-center justify-center rounded-full bg-white/70
                         backdrop-blur-sm border border-white disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goToImage(activeIndex + 1)}
              disabled={isLast}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2
                         items-center justify-center rounded-full bg-white/70
                         backdrop-blur-sm border border-white disabled:opacity-0"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => goToImage(index)}
              className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg
                          border-2 transition ${
                            index === activeIndex
                              ? "border-[var(--color-primary)]"
                              : "border-transparent opacity-50"
                          }`}
            >
              <Image src={image} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}