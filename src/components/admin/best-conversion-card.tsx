import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionCard } from "./conversion-card";

export function BestConversionCard({
  properties,
  referenceViews,
}: {
  properties: ConversionProperty[];
  referenceViews: number;
}) {
  return (
    <ConversionCard
      title="Mejor conversión"
      subtitle="Relación entre vistas y leads"
      properties={properties}
      referenceViews={referenceViews}
    />
  );
}