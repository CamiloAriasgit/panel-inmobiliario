import { Eye, Users } from "lucide-react";

export function ConversionBars({
  views,
  leads,
  referenceViews,
}: {
  views: number;
  leads: number;
  referenceViews: number;
}) {
  const toWidth = (value: number) => `${Math.min(value / referenceViews, 1) * 100}%`;

  return (
    <div className="space-y-3">
      {/* Views */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-end">
          <span className="text-xs font-medium text-neutral-500">{views}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={12} className="shrink-0 text-neutral-400" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]/40"
              style={{ width: toWidth(views), minWidth: views > 0 ? 2 : 0 }}
            />
          </div>
        </div>
      </div>

      {/* Leads */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-end">
          <span className="text-xs font-medium text-neutral-500">{leads}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="shrink-0 text-[var(--color-primary)]" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]"
              style={{ width: toWidth(leads), minWidth: leads > 0 ? 2 : 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}