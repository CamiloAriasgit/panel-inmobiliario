import { Eye, Users } from "lucide-react";

export function ConversionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-neutral-600">
      <span className="flex items-center gap-1.5 rounded-full bg-gray-100/70 px-2 pl-1 py-1">
        <div className="bg-[var(--color-primary)]/50 p-1 rounded-full">
            <Eye size={12} className="text-white" />
        </div>
        Vistas
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-white px-2 pl-1 py-1">
        <div className="bg-[var(--color-primary)] p-1 rounded-full">
            <Users size={12} className="text-white" />
        </div>
        Leads
      </span>
    </div>
  );
}