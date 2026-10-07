import Image from "next/image";
import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionBars } from "./conversion-bars";

export function BestConversionCard({ properties }: { properties: ConversionProperty[] }) {
  if (properties.length === 0) return null;

  const maxViews = Math.max(...properties.map((p) => p.clickCount), 1);
  const maxLeads = Math.max(...properties.map((p) => p.leadCount), 1);

  return (
    <div className="rounded-2xl bg-white p-5">
      <h2 className="mb-1 font-semibold text-neutral-900">Mejor conversión</h2>
      <p className="mb-4 text-xs text-neutral-400">Top 4 — más leads en relación a sus vistas</p>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image src={property.image} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 line-clamp-1 text-sm text-neutral-900">{property.title}</p>
              <ConversionBars
                views={property.clickCount}
                leads={property.leadCount}
                maxViews={maxViews}
                maxLeads={maxLeads}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}