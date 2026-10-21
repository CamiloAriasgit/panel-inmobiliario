import { Eye, Users } from "lucide-react";

export function ConversionLegend() {
  return (
    <div className="hidden items-center gap-2 text-xs text-neutral-600 md:flex">
      <span className="flex items-center gap-1.5 rounded-full bg-gray-200/80 px-1 md:pr-2 py-1">
        <div className="bg-[var(--color-primary)]/50 p-1 rounded-full">
            <Eye size={12} className="text-white" />
        </div>
        <span className="hidden sm:inline">Vistas</span>
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-gray-200/80 px-1 md:pr-2 py-1">
        <div className="bg-[var(--color-primary)] p-1 rounded-full">
            <Users size={12} className="text-white" />
        </div>
        <span className="hidden sm:inline">Leads</span>
      </span>
    </div>
  );
}