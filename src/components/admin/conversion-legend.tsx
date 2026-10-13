import { Eye, Users } from "lucide-react";

export function ConversionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-neutral-600">
      <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1">
        <Eye size={12} className="text-[var(--color-primary)]/40" />
        Vistas
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1">
        <Users size={12} className="text-[var(--color-primary)]" />
        Leads
      </span>
    </div>
  );
}