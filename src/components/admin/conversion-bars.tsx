import { Eye, Users } from "lucide-react";

export function ConversionBars({
  views,
  leads,
  maxViews,
  maxLeads,
}: {
  views: number;
  leads: number;
  maxViews: number;
  maxLeads: number;
}) {
  const viewsWidth = views > 0 && maxViews > 0 ? Math.max((views / maxViews) * 100, 4) : 0;
  const leadsWidth = leads > 0 && maxLeads > 0 ? Math.max((leads / maxLeads) * 100, 4) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Eye size={12} className="shrink-0 text-neutral-400" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-neutral-400"
            style={{ width: `${viewsWidth}%` }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{views}</span>
      </div>

      <div className="flex items-center gap-2">
        <Users size={12} className="shrink-0 text-[var(--color-primary)]" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: `${leadsWidth}%` }}
          />
        </div>
        <span className="w-6 shrink-0 text-right text-xs text-neutral-500">{leads}</span>
      </div>
    </div>
  );
}