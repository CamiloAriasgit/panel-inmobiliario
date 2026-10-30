import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function StatTile({
  icon: Icon,
  label,
  value,
  corner,
  href,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  // Dato secundario en la esquina inferior derecha (ej. "58 en total").
  corner?: string;
  // Si se indica, toda la tarjeta lleva a esa página.
  href?: string;
  className?: string;
}) {
  const content = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300/40 border border-gray-300 text-neutral-700">
          <Icon size={16} />
        </div>

        {href && (
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 transition group-hover:bg-neutral-800 group-hover:text-white"
          >
            <ArrowUpRight size={16} />
          </span>
        )}
      </div>

      <p className="text-3xl text-neutral-900">{value}</p>

      <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
        <p className="text-sm text-neutral-500">{label}</p>
        {corner && (
          <p className="shrink-0 rounded-md bg-gray-300/60 px-2 py-0.5 text-xs text-neutral-600">
            {corner}
          </p>
        )}
      </div>
    </>
  );

  const baseClassName = `rounded-4xl bg-gray-200 p-5 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`group block transition hover:bg-gray-100 ${baseClassName}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}