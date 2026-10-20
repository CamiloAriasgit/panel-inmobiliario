const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  lote: "Lote",
  local: "Local comercial",
  oficina: "Oficina",
};

export type PropertyTypeCount = {
  type: string;
  label: string;
  count: number;
  venta: number;
  renta: number;
};

export function getPropertyTypeBreakdown(
  properties: { property_type: string; listing_type: string }[]
): PropertyTypeCount[] {
  const groups = new Map<string, { count: number; venta: number; renta: number }>();

  for (const property of properties) {
    const group = groups.get(property.property_type) ?? { count: 0, venta: 0, renta: 0 };

    group.count += 1;
    if (property.listing_type === "venta") group.venta += 1;
    else if (property.listing_type === "renta") group.renta += 1;

    groups.set(property.property_type, group);
  }

  return Array.from(groups.entries())
    .map(([type, group]) => ({
      type,
      label: PROPERTY_TYPE_LABELS[type] ?? type,
      ...group,
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
  limit = 3
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

function getConversionAnalysis(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>
) {
  const published = properties.filter((property) => property.status === "published");

  // Mínimo de vistas para que una conversión sea confiable: 40 % del promedio
  // de vistas de la agencia, con un piso de 3.
  const totalViews = published.reduce((sum, property) => sum + property.click_count, 0);
  const avgViews = published.length > 0 ? totalViews / published.length : 0;
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

  // Las vistas son enteras, así que el mínimo que se muestra se redondea hacia arriba.
  return { rows, avgConversion, minViews: Math.ceil(viewsThreshold) };
}

// Las dos listas se arman con criterios que no pueden cumplirse a la vez, así
// que una propiedad nunca aparece en ambas:
//   - Mejor conversión: convierte al menos como el promedio de la agencia.
//   - Necesita atención: convierte menos de la mitad del promedio.
// Las que quedan en medio no aparecen en ninguna.

export function getBestConvertingProperties(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): ConversionProperty[] {
  const { rows, avgConversion } = getConversionAnalysis(properties, leadCountsByProperty);

  return rows
    .filter((row) => row.leadCount > 0 && row.conversionRate >= avgConversion)
    // A igual conversión, primero la que tiene más vistas (evidencia más sólida).
    .sort((a, b) => b.conversionRate - a.conversionRate || b.clickCount - a.clickCount)
    .slice(0, limit);
}

export function getPropertiesNeedingAttention(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number>,
  limit = 4
): ConversionProperty[] {
  const { rows, avgConversion } = getConversionAnalysis(properties, leadCountsByProperty);
  const conversionThreshold = avgConversion * 0.5;

  return rows
    .filter((row) => row.conversionRate < conversionThreshold)
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit);
}

// Mínimo de vistas vigente para esta agencia, para mostrarlo en las cards.
export function getConversionMinViews(
  properties: StatsProperty[],
  leadCountsByProperty: Map<string, number> = new Map()
): number {
  return getConversionAnalysis(properties, leadCountsByProperty).minViews;
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