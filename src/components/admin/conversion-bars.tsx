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
 
  const total = Math.max(views, leads);

  const outerWidth = `${Math.min(total / referenceViews, 1) * 100}%`;

  const innerWidth = total > 0 ? `${(leads / total) * 100}%` : "0%";

  return (
    <div
      role="img"
      aria-label={`${views} vistas, ${leads} leads`}
      title={`${views} vistas · ${leads} leads`}
      className="space-y-1"
    >

      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full overflow-hidden rounded-full bg-[var(--color-primary)]/40"
          style={{ width: outerWidth, minWidth: total > 0 ? 2 : 0 }}
        >         
        <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: innerWidth, minWidth: leads > 0 ? 2 : 0 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
        <span className="flex items-center gap-1">
          <div className="bg-[var(--color-primary)]/40 rounded-full">
            <Eye size={12} className="text-[var(--color-primary)]/0" />
          </div>
          {numberFormatter.format(views)}
          <span>visitas</span>
        </span>
        <span className="flex items-center gap-1">
          <div className="bg-[var(--color-primary)] rounded-full">
            <Users size={12} className="text-[var(--color-primary)]/0" />
          </div>
          {numberFormatter.format(leads)}
          <span>leads</span>
        </span>
      </div>

    </div>
  );
}