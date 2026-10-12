"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { brandConfig } from "@/lib/config/brand.config";
import { NAV_ITEMS } from "./nav-items";
import { AccountActions } from "./account-actions";

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    // Contenedor exterior: mide exactamente 100vh y se pega arriba. El
    // espacio con el borde de la pantalla es su padding (sin margen a la
    // derecha, porque ya lo da el layout de las páginas).
    <aside className="sticky top-0 hidden h-screen w-[16.5rem] shrink-0 p-2 pr-0 sm:block">
      <div className="flex h-full flex-col overflow-y-auto rounded-2xl bg-gray-200 p-4 scrollbar-hide">
        <div className="mb-6 px-2">
          <p className="font-semibold text-neutral-900">{brandConfig.name}</p>
          <p className="truncate text-xs text-neutral-500">{adminName}</p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-600 hover:bg-gray-300/70"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-1 mt-6 px-3 text-xs text-neutral-400">Acción rápida</p>
        <Link
          href="/admin/propiedades/nueva"
          className="flex items-center gap-3 rounded-full bg-white px-1.5 py-1.5 pl-4 text-sm font-medium text-neutral-600 hover:bg-gray-100"
        >
          <span className="flex-1">Nueva propiedad</span>
          <div className="rounded-full bg-gray-200 p-2">
            <Plus size={18} />
          </div>
        </Link>

        <div className="mt-auto rounded-lg bg-white p-5">
          <h2 className="mb-1 text-neutral-900">Cuenta</h2>
          <AccountActions />
        </div>
      </div>
    </aside>
  );
}