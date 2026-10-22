import { CircleFadingArrowUp, CheckCircle2, CirclePause, LucideIcon } from "lucide-react";

interface StatusConfig {
  label: string;
  styles: string;
  icon: LucideIcon;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: {
    label: "Borrador",
    styles: "bg-neutral-800/90 text-amber-500",
    icon: CircleFadingArrowUp,
  },
  published: {
    label: "Publicada",
    styles: "bg-neutral-800/90 text-green-500",
    icon: CheckCircle2,
  },
  archived: {
    label: "Archivada",
    styles: "bg-neutral-800/90 text-slate-500",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-0.5 md:px-1 md:pr-2 py-0.5 text-xs font-medium ${config.styles}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden md:flex">{config.label}</span>
    </span>
  );
}