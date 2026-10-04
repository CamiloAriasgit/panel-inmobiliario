import { CircleFadingArrowUp, CheckCircle2, CirclePause, LucideIcon } from "lucide-react";

interface StatusConfig {
  label: string;
  styles: string;
  icon: LucideIcon;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: {
    label: "Borrador",
    styles: "bg-gradient-to-tr from-amber-200 via-white/60 to-amber-200 text-amber-700",
    icon: CircleFadingArrowUp,
  },
  published: {
    label: "Publicada",
    styles: "bg-gradient-to-tr from-green-200 via-white/60 to-green-200 text-green-700",
    icon: CheckCircle2,
  },
  archived: {
    label: "Archivada",
    styles: "bg-gradient-to-tr from-gray-300 via-white/60 to-gray-300 text-slate-600",
    icon: CirclePause,
  },
};

const DEFAULT_CONFIG: StatusConfig = {
  label: "Desconocido",
  styles: "bg-gray-100 text-gray-600 border border-gray-200/60",
  icon: CircleFadingArrowUp,
};

export function PropertyStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    ...DEFAULT_CONFIG,
    label: status,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-xs font-medium ${config.styles}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}