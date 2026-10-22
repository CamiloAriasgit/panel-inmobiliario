"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import type { MostViewedProperty } from "@/lib/utils/property-stats";

export function MostViewedPropertiesCard({
  properties,
}: {
  properties: MostViewedProperty[];
}) {
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  return (
    <div className="rounded-xl bg-gray-200 p-5">
      <h2 className="mb-4 text-neutral-900">Más vistas</h2>
      {properties.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay suficientes datos.</p>
      ) : (
        <div className="relative flex items-center justify-center min-h-[240px] sm:min-h-[260px] px-8 sm:px-4 overflow-hidden sm:overflow-visible">
          {properties.slice(0, 3).map((property, index) => {
            // Posición e inclinación estáticas según el slot
            let baseStyle = "";
            let defaultZ = 10;

            if (index === 0) {
              // Posición 1: Centro, recta
              baseStyle = "relative rotate-0 scale-100";
              defaultZ = 30;
            } else if (index === 1) {
              // Posición 2: Izquierda, inclinada a la izquierda
              baseStyle = "absolute left-1/2 -translate-x-[88%] sm:-translate-x-[110%] -rotate-6 scale-95";
              defaultZ = 20;
            } else if (index === 2) {
              // Posición 3: Derecha, inclinada a la derecha
              baseStyle = "absolute left-1/2 -translate-x-[12%] sm:translate-x-[10%] rotate-6 scale-95";
              defaultZ = 10;
            }

            // Si es la card cliqueada pasa al frente con z-50; si no, conserva su z-index base
            const isSelected = activePropertyId === property.id;
            const zIndexClass = isSelected ? "z-50 shadow-2xl" : "";

            return (
              <div
                key={property.id}
                onClick={() => setActivePropertyId(property.id)}
                style={{ zIndex: isSelected ? 50 : defaultZ }}
                className={`w-40 sm:w-52 aspect-square rounded-xl bg-neutral-100 shadow-md transition-all duration-300 cursor-pointer ${baseStyle} ${zIndexClass}`}
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  <Image
                    src={property.image}
                    alt={property.title || "Propiedad"}
                    fill
                    className="object-cover"
                  />

                  <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-black z-10">
                    {index + 1}
                  </span>

                  <div className="absolute bottom-0 inset-x-0 m-2 p-2 rounded-lg bg-white">
                    <p className="line-clamp-1 text-sm font-medium text-gray-700 mb-1" title={property.title}>
                      {property.title}
                    </p>
                    <div className="flex items-center">
                      <span className="flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-neutral-800">
                        <Eye size={12} />
                        {property.clickCount} {property.clickCount === 1 ? "vista" : "vistas"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}