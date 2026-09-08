"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "lote", label: "Lote" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
];

type Filters = {
  listing_type?: string;
  property_type?: string;
  city?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
};

export function FilterPanel({
  currentFilters,
}: {
  currentFilters: Filters;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(currentFilters);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCount = Object.values(currentFilters).filter(Boolean).length;

  function updateDraft(key: keyof Filters, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value || undefined }));
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    (Object.keys(draft) as (keyof Filters)[]).forEach((key) => {
      const value = draft[key];
      if (value) {
        params.set(key, value);
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
        className="flex items-center gap-2 rounded-lg border border-gray-300
                   px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        <SlidersHorizontal size={16} />
        Filtros
        {activeCount > 0 && (
          <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-w-md rounded-lg border
                        border-gray-200 bg-white p-4 shadow-lg sm:w-96">
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
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Tipo de propiedad
              </label>
              <select
                value={draft.property_type ?? ""}
                onChange={(event) =>
                  updateDraft("property_type", event.target.value)
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="">Todos</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Ciudad</label>
              <input
                type="text"
                value={draft.city ?? ""}
                onChange={(event) => updateDraft("city", event.target.value)}
                placeholder="Ej. Medellín"
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
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
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
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
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
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
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
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
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
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