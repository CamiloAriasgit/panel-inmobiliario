import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionCard } from "./conversion-card";

export function BestConversionCard({
  properties,
  referenceViews,
  minViews,
}: {
  properties: ConversionProperty[];
  referenceViews: number;
  minViews: number;
}) {
  return (
    <ConversionCard
      title="Mejor conversión"
      subtitle="Relación entre vistas y leads"
      emptyMessage="Aún no hay propiedades con leads y tráfico suficiente."
      properties={properties}
      referenceViews={referenceViews}
      minViews={minViews}
    />
  );
}