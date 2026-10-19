"use client";

import { Children, useEffect, useRef, useState } from "react";

export function SnapCarousel({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [canScroll, setCanScroll] = useState(false);

  const count = Children.count(children);

  // ¿Hay más tarjetas de las que caben? En el grid de escritorio no.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function update() {
      setCanScroll(scroller!.scrollWidth > scroller!.clientWidth + 1);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [count]);

  // Qué tarjetas están a la vista (al menos el 60 % de cada una).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const index = cards.indexOf(entry.target as HTMLElement);
            if (index === -1) continue;
            // Se usa el porcentaje visible y no isIntersecting: este último
            // sigue en true mientras la tarjeta asome un solo píxel.
            if (entry.intersectionRatio >= 0.6) next.add(index);
            else next.delete(index);
          }
          return next;
        });
      },
      { root: scroller, threshold: 0.6 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [count]);

  function scrollToCard(index: number) {
    scrollerRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest", // no mueve la página en vertical
    });
  }

  return (
    // Los puntos de corte @md / @4xl miden el ancho de ESTE contenedor, no el
    // de la pantalla.
    <div className="@container">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide
                   @4xl:grid @4xl:grid-cols-4 @4xl:overflow-visible"
      >
        {Children.map(children, (child) => (
          <div
            className="min-w-0 shrink-0 basis-full snap-start
                       @md:basis-[calc(50%-0.5rem)]
                       @4xl:shrink @4xl:basis-auto"
          >
            {child}
          </div>
        ))}
      </div>

      {canScroll && (
        <div className="mt-3 flex justify-center gap-1.5">
          {Array.from({ length: count }, (_, index) => {
            const isVisible = visible.has(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollToCard(index)}
                aria-label={`Ir a la propiedad ${index + 1}`}
                aria-current={isVisible ? "true" : undefined}
                className="flex h-4 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    isVisible ? "w-4 bg-neutral-500" : "w-1.5 bg-neutral-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}