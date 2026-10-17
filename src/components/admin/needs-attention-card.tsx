import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionCard } from "./conversion-card";

export function NeedsAttentionCard({
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
      title="Necesita atención"
      subtitle="Mucho tráfico, pocos leads"
      emptyMessage="Ninguna propiedad con tráfico suficiente está muy por debajo del promedio."
      properties={properties}
      referenceViews={referenceViews}
      minViews={minViews}
    />
  );
}