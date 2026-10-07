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

export type AttentionProperty = {
  id: string;
  title: string;
  image: string;
  clickCount: number;
  leadCount: number;
  conversionRate: number;
};

export function getPropertiesNeedingAttention(
  properties: {
    id: string;
    title: string;
    images: string[] | null;
    click_count: number;
    status: string;
  }[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): AttentionProperty[] {
  const published = properties.filter((property) => property.status === "published");

  if (published.length === 0) return [];

  const totalViews = published.reduce((sum, property) => sum + property.click_count, 0);
  const avgViews = totalViews / published.length;
  const viewsThreshold = Math.max(avgViews * 0.4, 3);

  // La conversión promedio solo se calcula sobre propiedades que ya
  // cruzan el umbral de vistas — incluir las de muy poco tráfico
  // distorsionaría el promedio con tasas de 0% o 100% poco confiables.
  const eligible = published.filter((property) => property.click_count >= viewsThreshold);
  if (eligible.length === 0) return [];

  const totalEligibleViews = eligible.reduce((sum, property) => sum + property.click_count, 0);
  const totalEligibleLeads = eligible.reduce(
    (sum, property) => sum + (leadCountsByProperty.get(property.id) ?? 0),
    0
  );
  const avgConversion = totalEligibleViews > 0 ? totalEligibleLeads / totalEligibleViews : 0;
  const conversionThreshold = avgConversion * 0.5;

  return eligible
    .map((property) => {
      const leadCount = leadCountsByProperty.get(property.id) ?? 0;
      return {
        id: property.id,
        title: property.title,
        image: property.images?.[0] ?? "/placeholder-property.jpg",
        clickCount: property.click_count,
        leadCount,
        conversionRate: property.click_count > 0 ? leadCount / property.click_count : 0,
      };
    })
    .filter((property) => property.conversionRate < conversionThreshold)
    .sort((a, b) => b.clickCount - a.clickCount) // las de más tráfico desperdiciado primero
    .slice(0, limit);
}

export type ConversionProperty = {
  id: string;
  title: string;
  image: string;
  clickCount: number;
  leadCount: number;
  conversionRate: number;
};

export function getBestConvertingProperties(
  properties: {
    id: string;
    title: string;
    images: string[] | null;
    click_count: number;
    status: string;
  }[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): ConversionProperty[] {
  const published = properties.filter((property) => property.status === "published");
  if (published.length === 0) return [];

  const totalViews = published.reduce((sum, property) => sum + property.click_count, 0);
  const avgViews = totalViews / published.length;
  const viewsThreshold = Math.max(avgViews * 0.4, 3);

  const eligible = published.filter((property) => property.click_count >= viewsThreshold);

  return eligible
    .map((property) => {
      const leadCount = leadCountsByProperty.get(property.id) ?? 0;
      return {
        id: property.id,
        title: property.title,
        image: property.images?.[0] ?? "/placeholder-property.jpg",
        clickCount: property.click_count,
        leadCount,
        conversionRate: property.click_count > 0 ? leadCount / property.click_count : 0,
      };
    })
    // Sin este filtro, una propiedad con 0 leads podía colarse en el
    // top por descarte (si menos de `limit` propiedades tienen leads
    // reales) — "mejor conversión" no debería incluir nunca algo con
    // conversión nula, por definición.
    .filter((property) => property.leadCount > 0)
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, limit);
}