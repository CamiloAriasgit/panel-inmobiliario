import Image from "next/image";
import type { PropertyLeadCount } from "@/lib/utils/lead-stats";

export function TopPropertiesCard({ properties }: { properties: PropertyLeadCount[] }) {
  return (
    <div className="rounded-xl md:bg-white md:p-5">
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

              <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-black backdrop-blur-md z-10">
                {index + 1}
              </span>

              <div className="absolute bottom-0 inset-x-0 m-2 p-2 rounded-lg bg-white backdrop-blur-md">
                <p className="line-clamp-1 text-sm font-medium text-neutral-900 mb-1" title={property.title}>
                  {property.title}
                </p>
                <div className="flex items-center">
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-neutral-800">
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