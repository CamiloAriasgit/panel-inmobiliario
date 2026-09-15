"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { brandConfig } from "@/lib/config/brand.config";
import { SearchBar } from "./search-bar";
import { FilterPanel, type RawFilters } from "./filter-panel";
import { ViewTogglePill } from "./view-toggle-pill";

export function SiteHeader({
  view,
  searchDefaultValue,
  currentFilters,
}: {
  view: "list" | "map";
  searchDefaultValue?: string;
  currentFilters: RawFilters;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      // Solo colapsa después de bajar un poco (80px), para que no se
      // oculte con micro-movimientos cerca del tope de la página.
      if (currentY > 80 && scrollingDown) {
        setCollapsed(true);
      } else if (!scrollingDown) {
        setCollapsed(false);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMapView = view === "map";
  const showMobileLogo = !isMapView && !collapsed;
  const showDesktopLogo = !isMapView;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white px-4 py-4 lg:px-20">
      {/* Mobile: logo colapsable arriba, búsqueda + filtro siempre visibles */}
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

      {/* Desktop: una sola fila; el logo se oculta en vista mapa, sin mover el buscador */}
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
          <ViewTogglePill view={view} />
        </div>
      </div>
    </header>
  );
}