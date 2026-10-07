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
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-600 hover:bg-gray-200/70"
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
        className="flex items-center gap-3 rounded-full px-1.5 py-1.5 pl-4 text-sm font-medium text-neutral-600 bg-gray-200/70 hover:bg-gray-200 shadow-inner"
      >
        <span className="flex-1">Nueva propiedad</span>
        <div className="bg-white rounded-full p-2 shadow">
            <Plus size={18} />
        </div>
      </Link>

     
      <div className="mt-auto bg-gray-200/70 rounded-lg  p-5 shadow-inner">
        <h2 className="mb-1 text-neutral-900">Cuenta</h2>
        <AccountActions />
      </div>
    </aside>
  );
}