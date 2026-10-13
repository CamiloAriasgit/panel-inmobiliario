import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionLegend } from "./conversion-legend";
import { ConversionRow } from "./conversion-row";

export function ConversionCard({
  title,
  subtitle,
  properties,
  referenceViews,
}: {
  title: string;
  subtitle: string;
  properties: ConversionProperty[];
  referenceViews: number;
}) {
  if (properties.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gray-200 p-5">
      {/* Móvil: la leyenda baja bajo el título. Desktop: misma fila. */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="text-neutral-900">{title}</h2>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
        <ConversionLegend />
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <ConversionRow
            key={property.id}
            property={property}
            referenceViews={referenceViews}
          />
        ))}
      </div>
    </div>
  );
}