import Image from "next/image";
import { Eye } from "lucide-react";
import type { AttentionProperty } from "@/lib/utils/property-stats";

export function NeedsAttentionCard({ properties }: { properties: AttentionProperty[] }) {
  if (properties.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-5">
      <h2 className="mb-1 font-semibold text-neutral-900">Necesita atención</h2>
      <p className="mb-4 text-xs text-neutral-400">
        Mucho interés, pocos leads — podrían mejorar con otras fotos o precio
      </p>

      <div className="space-y-3">
        {properties.map((property) => (
          <div key={property.id} className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image src={property.image} alt="" fill className="object-cover" />
            </div>
            <p className="line-clamp-1 flex-1 text-sm text-neutral-900">{property.title}</p>
            <span className="flex items-center gap-1 rounded-full bg-gray-200/70 px-2 py-0.5 text-xs text-neutral-600">
              <Eye size={12} />
              {property.clickCount}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              {property.leadCount} leads
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}