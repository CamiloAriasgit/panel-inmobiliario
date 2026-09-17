"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function PropertyGalleryMobile({
  images,
  title,
}: {
  images: string[];
  title: string;
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
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex aspect-square w-full snap-x snap-mandatory
                   overflow-x-auto scrollbar-hide"
      >
        {images.map((image, index) => (
          <div
            key={image + index}
            className="relative aspect-square w-full flex-shrink-0 snap-center"
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