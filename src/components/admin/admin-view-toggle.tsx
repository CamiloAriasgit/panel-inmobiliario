import Link from "next/link";
import { List, BarChart2 } from "lucide-react";

export function AdminViewToggle({
  tab,
  className = "mb-4 lg:hidden",
}: {
  tab: "list" | "stats";
  // Margen y visibilidad según dónde se use. Al pasarlo, reemplaza el valor
  // por defecto completo, así que no se mezcla con sus condiciones de
  // ocultamiento.
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-full bg-gray-200/70 p-1 ${className}`}>
      <Link
        href="?tab=list"
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm ${
          tab === "list" ? "bg-white text-neutral-900" : "text-neutral-500"
        }`}
      >
        <List size={14} />
        Lista
      </Link>
      <Link
        href="?tab=stats"
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm ${
          tab === "stats" ? "bg-white text-neutral-900" : "text-neutral-500"
        }`}
      >
        <BarChart2 size={14} />
        Estadísticas
      </Link>
    </div>
  );
}