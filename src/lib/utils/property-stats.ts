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

// ---------------------------------------------------------------
// Conversión (vistas vs. leads)
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// Conversión (vistas vs. leads)
// ---------------------------------------------------------------

type StatsProperty = {
  id: string;
  title: string;
  images: string[] | null;
  click_count: number;
  status: string;
};

export type ConversionProperty = {
  id: string;
  title: string;
  image: string;
  clickCount: number;
  leadCount: number;
  conversionRate: number; // leads / vistas de esta propiedad (0..1)
};

export type AttentionProperty = ConversionProperty;

function getConversionRows(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>
) {
  const published = properties.filter((property) => property.status === "published");
  if (published.length === 0) {
    return { rows: [] as ConversionProperty[], avgConversion: 0 };
  }

  const totalViews = published.reduce((sum, property) => sum + property.click_count, 0);
  const avgViews = totalViews / published.length;
  const viewsThreshold = Math.max(avgViews * 0.4, 3);

  const rows: ConversionProperty[] = published
    .filter((property) => property.click_count >= viewsThreshold)
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
    });

  const eligibleViews = rows.reduce((sum, row) => sum + row.clickCount, 0);
  const eligibleLeads = rows.reduce((sum, row) => sum + row.leadCount, 0);
  const avgConversion = eligibleViews > 0 ? eligibleLeads / eligibleViews : 0;

  return { rows, avgConversion };
}

export function getBestConvertingProperties(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): ConversionProperty[] {
  const { rows } = getConversionRows(properties, leadCountsByProperty);

  return rows
    .filter((row) => row.leadCount > 0)
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, limit);
}

export function getPropertiesNeedingAttention(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): ConversionProperty[] {
  const { rows, avgConversion } = getConversionRows(properties, leadCountsByProperty);
  const conversionThreshold = avgConversion * 0.5;

  return rows
    .filter((row) => row.conversionRate < conversionThreshold)
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit);
}

export function formatConversionRate(rate: number): string {
  return `${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(rate * 100)} %`;
}

// Referencia común de las dos tablas: las vistas de la propiedad más vista
// entre todas las que se muestran. Su barra de vistas va llena, y los
// leads de todas se miden contra esta misma cifra.
export function getViewsReference(...lists: { clickCount: number }[][]): number {
  return Math.max(...lists.flat().map((property) => property.clickCount), 1);
}