import { Eye, Users } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("es-CO");

export function ConversionBars({
  views,
  leads,
  referenceViews,
}: {
  views: number;
  leads: number;
  referenceViews: number;
}) {
  // Largo de la barra translúcida. Normalmente son las vistas, pero un lead
  // puede llegar desde la card sin que se abra el detalle y haber más leads
  // que vistas; en ese caso se usa el mayor de los dos para que la parte
  // sólida nunca sobrepase a la translúcida.
  const total = Math.max(views, leads);

  const outerWidth = `${Math.min(total / referenceViews, 1) * 100}%`;

  // La parte sólida se mide contra la translúcida (leads / total). Como las
  // dos usan la misma referencia, su largo real es leads / referenceViews.
  const innerWidth = total > 0 ? `${(leads / total) * 100}%` : "0%";

  return (
    <div
      role="img"
      aria-label={`${views} vistas, ${leads} leads`}
      title={`${views} vistas · ${leads} leads`}
      className="space-y-1"
    >
      <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
        <span className="flex items-center gap-1">
          <Eye size={12} className="text-[var(--color-primary)]/40" />
          {numberFormatter.format(views)}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} className="text-[var(--color-primary)]" />
          {numberFormatter.format(leads)}
        </span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
        {/* Translúcida: vistas */}
        <div
          className="h-full overflow-hidden rounded-full bg-[var(--color-primary)]/40"
          style={{ width: outerWidth, minWidth: total > 0 ? 2 : 0 }}
        >
          {/* Sólida, dentro de la anterior: leads */}
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: innerWidth, minWidth: leads > 0 ? 2 : 0 }}
          />
        </div>
      </div>
    </div>
  );
}