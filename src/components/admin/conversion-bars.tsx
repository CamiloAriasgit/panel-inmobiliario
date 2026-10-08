import { Eye, MessageCircle } from "lucide-react";

export function ConversionBars({
  views,
  leads,
  viewsOfTotal,
  leadsOfTotal,
}: {
  views: number;
  leads: number;
  viewsOfTotal: number;
  leadsOfTotal: number;
}) {
  // Las dos pistas representan el 100 % de las vistas del portal, así que
  // el ancho es la fracción real, sin piso artificial. Solo se garantizan
  // 2 px a los valores mayores que cero para que no desaparezcan.
  const toWidth = (fraction: number) => `${Math.min(fraction, 1) * 100}%`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Eye size={12} className="shrink-0 text-neutral-400" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-neutral-400"
            style={{ width: toWidth(viewsOfTotal), minWidth: views > 0 ? 2 : 0 }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{views}</span>
      </div>

      <div className="flex items-center gap-2">
        <MessageCircle size={12} className="shrink-0 text-[var(--color-primary)]" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: toWidth(leadsOfTotal), minWidth: leads > 0 ? 2 : 0 }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{leads}</span>
      </div>
    </div>
  );
}