import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionCard } from "./conversion-card";

export function NeedsAttentionCard({
  properties,
  referenceViews,
}: {
  properties: ConversionProperty[];
  referenceViews: number;
}) {
  return (
    <ConversionCard
      title="Necesita atención"
      subtitle="Mucho tráfico, casi sin leads"
      properties={properties}
      referenceViews={referenceViews}
    />
  );
}