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
  children?: React.ReactNode; 
}) {
  return (
    <div className="mb-6 hidden items-center justify-between gap-4 sm:flex">
      <h1 className="text-2xl text-neutral-900">{title}</h1>

      <div className="flex items-center gap-2">
        {children}

        {createHref && createLabel && (
          <Link
            href={createHref}
            className="flex items-center gap-2 rounded-full bg-white px-4 pl-1.5 py-1.5 text-sm font-medium text-neutral-700 hover:opacity-90"
          >
            <div className="rounded-full bg-gray-200 p-2">
              <Plus size={16} />
            </div>
            {createLabel}
          </Link>
        )}
      </div>
    </div>
  );
}