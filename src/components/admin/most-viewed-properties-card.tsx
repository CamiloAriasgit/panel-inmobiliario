import Image from "next/image";
import { MousePointerClick } from "lucide-react";
import type { MostViewedProperty } from "@/lib/utils/property-stats";

export function MostViewedPropertiesCard({
  properties,
}: {
  properties: MostViewedProperty[];
}) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <h2 className="mb-4 font-semibold text-neutral-900">Más vistas</h2>

      {properties.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay suficientes datos.</p>
      ) : (
        <div className="space-y-3">
          {properties.map((property, index) => (
            <div key={property.id} className="flex items-center gap-3">
              <span className="w-4 text-sm text-neutral-400">{index + 1}</span>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={property.image} alt="" fill className="object-cover" />
              </div>
              <p className="line-clamp-1 flex-1 text-sm text-neutral-900">{property.title}</p>
              <span className="flex items-center gap-1 rounded-full bg-gray-200/70 px-2 py-0.5 text-xs text-neutral-600">
                <MousePointerClick size={12} />
                {property.clickCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}