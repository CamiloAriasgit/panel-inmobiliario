import Image from "next/image";
import { Eye } from "lucide-react";
import type { MostViewedProperty } from "@/lib/utils/property-stats";

export function MostViewedPropertiesCard({
  properties,
}: {
  properties: MostViewedProperty[];
}) {
  return (
    <div className="rounded-xl md:bg-gray-200 md:p-5">
      <h2 className="mb-4 text-neutral-900">Más vistas</h2>
      {properties.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay suficientes datos.</p>
      ) : (
        /* Contenedor flexible centrado con altura fija/minima para albergar las cards superpuestas */
        <div className="relative flex items-center justify-center min-h-[220px] sm:min-h-[260px] py-4 overflow-hidden sm:overflow-visible">
          {properties.slice(0, 3).map((property, index) => {
            // Posicionamiento e inclinación según el orden
            let cardStyle = "";
            
            if (index === 0) {
              // Posición 1: Centro, al frente sin inclinación
              cardStyle = "relative z-30 scale-100 shadow-xl";
            } else if (index === 1) {
              // Posición 2: Izquierda, detrás, inclinada a la izquierda
              cardStyle = "absolute left-1/2 -translate-x-[110%] z-20 -rotate-6 scale-95 hover:z-40 transition-transform";
            } else if (index === 2) {
              // Posición 3: Derecha, detrás, inclinada a la derecha
              cardStyle = "absolute left-1/2 translate-x-[10%] z-10 rotate-6 scale-95 hover:z-40 transition-transform";
            }

            return (
              <div
                key={property.id}
                className={`w-40 sm:w-52 aspect-square rounded-xl bg-neutral-100 shadow-md transition-all duration-300 ${cardStyle}`}
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