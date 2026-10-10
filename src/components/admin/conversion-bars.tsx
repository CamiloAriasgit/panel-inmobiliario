import { Eye, MessageCircle } from "lucide-react";

export function ConversionBars({
  views,
  leads,
  referenceViews,
}: {
  views: number;
  leads: number;
  referenceViews: number;
}) {
  // Ambas barras usan la misma referencia (vistas), así que el largo de la
  // de leads respecto a la de vistas es exactamente la tasa de conversión.
  // Solo se garantizan 2 px a los valores mayores que cero.
  const toWidth = (value: number) => `${Math.min(value / referenceViews, 1) * 100}%`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Eye size={12} className="shrink-0 text-neutral-400" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-neutral-400"
            style={{ width: toWidth(views), minWidth: views > 0 ? 2 : 0 }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{views}</span>
      </div>

      <div className="flex items-center gap-2">
        <MessageCircle size={12} className="shrink-0 text-[var(--color-primary)]" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: toWidth(leads), minWidth: leads > 0 ? 2 : 0 }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{leads}</span>
      </div>
    </div>
  );
}