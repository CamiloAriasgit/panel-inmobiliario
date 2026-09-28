const TIME_ZONE = "America/Bogota";

// "en-CA" es el truco para obtener el formato AAAA-MM-DD, que es
// justo lo que sirve como llave de agrupación y se compara como texto.
const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getDayKey(date: Date): string {
  return dayKeyFormatter.format(date);
}

// Resta un día trabajando sobre la llave de texto, no sobre la hora
// real, para que no dependa de cambios de horario de verano.
function getPreviousDayKey(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date, includeYear: boolean): string {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(date);
}

export type DayGroup<T> = {
  key: string;
  label: string;
  items: T[];
};

// Los items deben llegar ya ordenados del más reciente al más antiguo
// (la consulta de Supabase ya lo hace); el orden de los grupos sale
// del orden en que aparece cada día por primera vez.
export function groupByDay<T extends { created_at: string }>(
  items: T[]
): DayGroup<T>[] {
  const todayKey = getDayKey(new Date());
  const yesterdayKey = getPreviousDayKey(todayKey);
  const currentYear = todayKey.slice(0, 4);

  const groups = new Map<string, DayGroup<T>>();

  for (const item of items) {
    const date = new Date(item.created_at);
    const key = getDayKey(date);

    let group = groups.get(key);

    if (!group) {
      let label: string;

      if (key === todayKey) {
        label = "Hoy";
      } else if (key === yesterdayKey) {
        label = "Ayer";
      } else {
        // El año solo se muestra si es distinto al actual, para que
        // el subtítulo se mantenga corto en el caso más común.
        label = formatDayLabel(date, key.slice(0, 4) !== currentYear);
      }

      group = { key, label, items: [] };
      groups.set(key, group);
    }

    group.items.push(item);
  }

  return Array.from(groups.values());
}