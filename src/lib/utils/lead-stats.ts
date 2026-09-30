const TIME_ZONE = "America/Bogota";

const monthKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
});

function getLeadMonthKey(dateString: string): string {
  // Se calcula en la hora de Colombia, no en la del servidor — así un
  // lead de las 11 p. m. no queda clasificado en el mes siguiente.
  return monthKeyFormatter.format(new Date(dateString));
}

function shiftMonthKey(year: number, month: number, delta: number) {
  const totalMonths = month - 1 + delta;
  const newYear = year + Math.floor(totalMonths / 12);
  const newMonth = ((totalMonths % 12) + 12) % 12;
  return { year: newYear, month: newMonth + 1 };
}

function formatMonthLabel(year: number, month: number, includeYear: boolean) {
  // Ancla al día 15 al mediodía UTC para evitar cualquier corrimiento
  // de día al formatear — aquí solo interesa el nombre del mes.
  const anchor = new Date(Date.UTC(year, month - 1, 15, 12));
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "UTC",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(anchor);
}

export type MonthlyLeadCount = { key: string; label: string; count: number };

export function getMonthlyLeadCounts(
  leads: { created_at: string }[],
  monthsBack = 6
): MonthlyLeadCount[] {
  const nowKey = monthKeyFormatter.format(new Date());
  const [nowYear, nowMonth] = nowKey.split("-").map(Number);

  const buckets: MonthlyLeadCount[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const { year, month } = shiftMonthKey(nowYear, nowMonth, -i);
    const key = `${year}-${String(month).padStart(2, "0")}`;
    buckets.push({
      key,
      label: formatMonthLabel(year, month, year !== nowYear),
      count: 0,
    });
  }

  const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const lead of leads) {
    const bucket = bucketByKey.get(getLeadMonthKey(lead.created_at));
    if (bucket) bucket.count += 1;
  }

  return buckets;
}

export type PropertyLeadCount = {
  propertyId: string;
  title: string;
  image: string;
  count: number;
};

export function getTopProperties(
  leads: {
    property_id: string | null;
    properties: { title: string; images: string[] | null } | null;
  }[],
  limit = 3
): PropertyLeadCount[] {
  const counts = new Map<string, PropertyLeadCount>();

  for (const lead of leads) {
    if (!lead.property_id || !lead.properties) continue;

    const existing = counts.get(lead.property_id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(lead.property_id, {
        propertyId: lead.property_id,
        title: lead.properties.title,
        image: lead.properties.images?.[0] ?? "/placeholder-property.jpg",
        count: 1,
      });
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}