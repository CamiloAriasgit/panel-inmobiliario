"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  Building2,
  Home,
  Trees,
  Store,
  Briefcase,
} from "lucide-react";

const PROPERTY_TYPES = [
  { value: "", label: "Todos", icon: LayoutGrid },
  { value: "apartamento", label: "Apartamento", icon: Building2 },
  { value: "casa", label: "Casa", icon: Home },
  { value: "lote", label: "Lote", icon: Trees },
  { value: "local", label: "Local comercial", icon: Store },
  { value: "oficina", label: "Oficina", icon: Briefcase },
];

// Forma en que llegan los filtros desde la URL (todo son strings planos,
// property_type es una lista separada por comas, ej. "apartamento,casa").
type RawFilters = {
  listing_type?: string;
  property_type?: string;
  city?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
};

// Forma del estado interno del formulario mientras el usuario edita
// (property_type ya convertido a array para las pills seleccionables).
type Filters = {
  listing_type?: string;
  property_type?: string[];
  city?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
};

export function FilterPanel({
  currentFilters,
}: {
  currentFilters: RawFilters;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(() => ({
    ...currentFilters,
    property_type: currentFilters.property_type
      ? currentFilters.property_type.split(",").filter(Boolean)
      : undefined,
  }));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCount = Object.values(currentFilters).filter(Boolean).length;

  function updateDraft(key: keyof Filters, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value || undefined }));
  }

  function togglePropertyType(value: string) {
    setDraft((prev) => {
      const current = prev.property_type ?? [];

      // "Todos" (value === "") limpia cualquier selección específica.
      if (value === "") {
        return { ...prev, property_type: undefined };
      }

      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return { ...prev, property_type: next.length > 0 ? next : undefined };
    });
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    (Object.keys(draft) as (keyof Filters)[]).forEach((key) => {
      const value = draft[key];

      if (key === "property_type") {
        const types = value as string[] | undefined;
        if (types && types.length > 0) {
          params.set("property_type", types.join(","));
        } else {
          params.delete("property_type");
        }
        return;
      }

      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/?${params.toString()}`);
      setIsOpen(false);
    });
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const keys: (keyof Filters)[] = [
      "listing_type",
      "property_type",
      "city",
      "min_price",
      "max_price",
      "min_area",
      "max_area",
    ];
    keys.forEach((key) => params.delete(key));
    setDraft({});

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Filtros"
        className="relative flex items-center justify-center rounded-full bg-white border border-gray-300
                   p-4 hover:bg-gray-100"
      >
        <SlidersHorizontal size={18} />
        {activeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-medium text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-24 z-20 max-h-[80vh] overflow-y-auto rounded-lg
                     border border-gray-200 bg-white p-4 shadow-lg
                     sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2
                     sm:max-h-none sm:w-96 sm:max-w-md sm:overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filtrar propiedades</h3>
            <button type="button" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Negocio</label>
              <div className="flex gap-2">
                {[
                  { value: "", label: "Todos" },
                  { value: "venta", label: "Venta" },
                  { value: "renta", label: "Renta" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateDraft("listing_type", option.value)}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      (draft.listing_type ?? "") === option.value
                        ? "border-none bg-gray-200 text-black"
                        : "border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Tipo de propiedad
              </label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => {
                  const isActive =
                    type.value === ""
                      ? !draft.property_type || draft.property_type.length === 0
                      : (draft.property_type ?? []).includes(type.value);

                  return (
                    <button
                      key={type.value || "all"}
                      type="button"
                      onClick={() => togglePropertyType(type.value)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                        isActive
                          ? "border-none bg-gray-200 text-black"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <type.icon size={14} />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Ciudad</label>
              <input
                type="text"
                value={draft.city ?? ""}
                onChange={(event) => updateDraft("city", event.target.value)}
                placeholder="Ej. Medellín"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Precio mín.
                </label>
                <input
                  type="number"
                  value={draft.min_price ?? ""}
                  onChange={(event) =>
                    updateDraft("min_price", event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Precio máx.
                </label>
                <input
                  type="number"
                  value={draft.max_price ?? ""}
                  onChange={(event) =>
                    updateDraft("max_price", event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Área mín. (m²)
                </label>
                <input
                  type="number"
                  value={draft.min_area ?? ""}
                  onChange={(event) =>
                    updateDraft("min_area", event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Área máx. (m²)
                </label>
                <input
                  type="number"
                  value={draft.max_area ?? ""}
                  onChange={(event) =>
                    updateDraft("max_area", event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:underline"
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              onClick={applyFilters}
              disabled={isPending}
              className="rounded-md bg-[var(--color-primary)] px-4 py-2
                         text-sm text-white disabled:opacity-60"
            >
              {isPending ? "Aplicando..." : "Aplicar filtros"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}