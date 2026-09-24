import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminListHeader({
  title,
  createHref,
  createLabel,
  children,
}: {
  title: string;
  createHref?: string;
  createLabel?: string;
  children?: React.ReactNode; // slot para búsqueda/filtros específicos de cada página
}) {
  return (
    <div className="mb-6 hidden items-center justify-between gap-4 sm:flex">
      <h1 className="text-2xl text-neutral-900">{title}</h1>

      <div className="flex items-center gap-2">
        {children}

        {createHref && createLabel && (
          <Link
            href={createHref}
            className="flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={16} />
            {createLabel}
          </Link>
        )}
      </div>
    </div>
  );
}