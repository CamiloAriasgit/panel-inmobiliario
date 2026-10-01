import Image from "next/image";
import type { PropertyLeadCount } from "@/lib/utils/lead-stats";

export function TopPropertiesCard({ properties }: { properties: PropertyLeadCount[] }) {
  return (
    <div className="rounded-xl lg:bg-white lg:p-5">
      <h2 className="mb-4 text-neutral-900">Propiedades con más leads</h2>

      {properties.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay suficientes datos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {properties.map((property, index) => (
            <div
              key={property.propertyId}
              className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm"
            >
              <Image
                src={property.image}
                alt={property.title || "Propiedad"}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white backdrop-blur-md">
                {index + 1}
              </span>

              <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                <p className="line-clamp-1 text-sm font-medium mb-1" title={property.title}>
                  {property.title}
                </p>
                <div className="flex items-center">
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs text-white border border-white/10">
                    {property.count} {property.count === 1 ? "lead" : "leads"}
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