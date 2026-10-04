const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  lote: "Lote",
  local: "Local comercial",
  oficina: "Oficina",
};

export type PropertyTypeCount = { type: string; label: string; count: number };

export function getPropertyTypeBreakdown(
  properties: { property_type: string }[]
): PropertyTypeCount[] {
  const counts = new Map<string, number>();

  for (const property of properties) {
    counts.set(property.property_type, (counts.get(property.property_type) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([type, count]) => ({
      type,
      label: PROPERTY_TYPE_LABELS[type] ?? type,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getListingTypeCounts(properties: { listing_type: string }[]) {
  let venta = 0;
  let renta = 0;

  for (const property of properties) {
    if (property.listing_type === "venta") venta += 1;
    else if (property.listing_type === "renta") renta += 1;
  }

  return { venta, renta };
}

export type MostViewedProperty = {
  id: string;
  title: string;
  image: string;
  clickCount: number;
};

export function getMostViewedProperties(
  properties: {
    id: string;
    title: string;
    images: string[] | null;
    click_count: number;
  }[],
  limit = 5
): MostViewedProperty[] {
  return [...properties]
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, limit)
    .map((property) => ({
      id: property.id,
      title: property.title,
      image: property.images?.[0] ?? "/placeholder-property.jpg",
      clickCount: property.click_count,
    }));
}