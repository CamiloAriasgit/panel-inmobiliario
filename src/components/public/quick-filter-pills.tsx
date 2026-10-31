"use client";

import Link from "next/link";
import { PROPERTY_TYPES } from "./filter-panel";
import type { QueryParams } from "./view-toggle-pill";

const LISTING_TYPES = [
  { value: "venta", label: "Venta" },
  { value: "renta", label: "Renta" },
];

// Arma el enlace que activa o desactiva un valor, conservando el resto de
// parámetros de la URL (búsqueda, vista, precios, etc.).
function toggleHref(
  params: QueryParams,
  key: "listing_type" | "property_type",
  value: string,
  isActive: boolean
) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    if (paramValue) search.set(paramKey, paramValue);
  });

  if (key === "listing_type") {
    if (isActive) search.delete("listing_type");
    else search.set("listing_type", value);
  } else {
    const current = (params.property_type ?? "").split(",").filter(Boolean);
    const next = isActive
      ? current.filter((type) => type !== value)
      : [...current, value];

    if (next.length > 0) search.set("property_type", next.join(","));
    else search.delete("property_type");
  }

  return `?${search.toString()}`;
}

const PILL_BASE =
  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm";
const PILL_ACTIVE = "border-transparent bg-gray-200 text-black";
const PILL_IDLE = "border-gray-300 text-gray-700 hover:bg-gray-50";

// Altura fija (h-10 + mt-4): debe coincidir con la fila del logo del header
// (h-10 + mb-4) para que el header mida lo mismo en lista y en mapa.
export function QuickFilterPills({ params }: { params: QueryParams }) {
  const activeTypes = (params.property_type ?? "").split(",").filter(Boolean);

  return (
    <div
      role="group"
      aria-label="Filtros rápidos"
      className="-mx-4 mt-4 flex h-10 items-center gap-2 overflow-x-auto px-4 scrollbar-hide"
    >
      {LISTING_TYPES.map((type) => {
        const isActive = params.listing_type === type.value;

        return (
          <Link
            key={type.value}
            href={toggleHref(params, "listing_type", type.value, isActive)}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={`${PILL_BASE} ${isActive ? PILL_ACTIVE : PILL_IDLE}`}
          >
            {type.label}
          </Link>
        );
      })}

      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-gray-200" />

      {PROPERTY_TYPES.filter((type) => type.value !== "").map((type) => {
        const isActive = activeTypes.includes(type.value);

        return (
          <Link
            key={type.value}
            href={toggleHref(params, "property_type", type.value, isActive)}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={`${PILL_BASE} ${isActive ? PILL_ACTIVE : PILL_IDLE}`}
          >
            <type.icon size={14} />
            {type.label}
          </Link>
        );
      })}
    </div>
  );
}