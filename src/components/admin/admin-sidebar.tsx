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
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-white p-4 scrollbar-hide sm:flex">
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
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-neutral-600 hover:bg-gray-100"
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
        className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 bg-gray-100 hover:bg-gray-200"
      >
        <span className="flex-1">Nueva propiedad</span>
        <Plus size={18} />
      </Link>

     
      <div className="mt-auto bg-gray-200/70 rounded-lg  p-5">
        <h2 className="mb-1 font-semibold text-neutral-900">Cuenta</h2>
        <AccountActions />
      </div>
    </aside>
  );
}