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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm"
            >
              <Image
                src={property.image}
                alt={property.title || "Propiedad"}
                fill
                className="object-cover"
              />

              <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-black backdrop-blur-md z-10">
                {index + 1}
              </span>

              <div className="absolute bottom-0 inset-x-0 m-2 p-2 rounded-lg bg-black/25 backdrop-blur-xs">
                <p className="line-clamp-1 text-sm font-medium text-gray-100 mb-1" title={property.title}>
                  {property.title}
                </p>
                <div className="flex items-center">
                  <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-800">
                    <Eye size={12} />
                    {property.clickCount} {property.clickCount === 1 ? "vista" : "vistas"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}