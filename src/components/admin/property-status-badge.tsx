const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-neutral-600",
  published: "bg-[var(--color-primary)]/20 text-[var(--color-primary)]",
  archived: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  published: "Publicada",
  archived: "Archivada",
};

export function PropertyStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-neutral-600"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}