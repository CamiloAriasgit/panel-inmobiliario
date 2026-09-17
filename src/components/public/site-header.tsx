"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { brandConfig } from "@/lib/config/brand.config";
import { SearchBar } from "./search-bar";
import { FilterPanel, type RawFilters } from "./filter-panel";
import { ViewTogglePill, type QueryParams } from "./view-toggle-pill";

export function SiteHeader({
  view,
  searchDefaultValue,
  currentFilters,
  allParams,
}: {
  view: "list" | "map";
  searchDefaultValue?: string;
  currentFilters: RawFilters;
  allParams: QueryParams;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Mide la altura REAL del header cada vez que cambia (logo
  // visible/oculto, colapsado/expandido, mobile/desktop) y la publica
  // como variable CSS. Nada más en la app vuelve a adivinar un número.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    function updateHeight() {
      const height = el!.offsetHeight;
      setHeaderHeight(height);
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`
      );
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function update() {
      const currentY = window.scrollY;

      if (currentY < 80) {
        setCollapsed(false);
      } else if (Math.abs(currentY - lastY.current) > 10) {
        setCollapsed(currentY > lastY.current);
      }

      lastY.current = currentY;
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isMapView = view === "map";
  // Mobile: el logo solo tiene sentido si hay scroll para colapsarlo;
  // en modo mapa no hay scroll, así que se oculta directamente.
  const showMobileLogo = !isMapView && !collapsed;
  // Desktop: el logo vive en su propia columna de ancho fijo y nunca
  // afecta la altura de la fila, así que se muestra siempre.
  const showDesktopLogo = true;

  return (
    <>
      {/* Reserva exactamente la altura medida del header real. */}
      <div style={{ height: headerHeight || undefined }} className="sm:block" />

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white px-4 py-4 lg:px-20"
      >
        <div className="sm:hidden">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showMobileLogo ? "mb-4 max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex justify-center">
              <Image
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
          </div>

          <div className="flex items-start justify-center gap-1">
            <SearchBar defaultValue={searchDefaultValue} />
            <FilterPanel currentFilters={currentFilters} />
          </div>
        </div>

        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex w-[140px] justify-start">
            {showDesktopLogo && (
              <Image
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            )}
          </div>

          <div className="flex flex-1 items-start justify-center gap-1 px-6">
            <SearchBar defaultValue={searchDefaultValue} />
            <FilterPanel currentFilters={currentFilters} />
          </div>

          <div className="flex w-[140px] justify-end">
            <ViewTogglePill view={view} params={allParams} />
          </div>
        </div>
      </header>
    </>
  );
}