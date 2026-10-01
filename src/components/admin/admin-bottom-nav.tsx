"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 pb-2 z-30 flex justify-center sm:hidden bg-gradient-to-b from-transparent via-gray-200/30 to-gray-200/70"
      aria-label="Navegación principal"
    >
      <div className="flex items-center gap-2 rounded-full bg-gray-500/5 p-2 backdrop-blur-md shadow-xl shadow-neutral-800/7">
        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-1.5 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition ${isActive
                    ? "bg-[var(--color-primary)] text-white shadow-inner shadow-white"
                    : "text-neutral-900"
                  }`}
              >
                <item.icon size={20} />
              </Link>
            );
          })}
        </div>

        <Link
          href="/admin/propiedades/nueva"
          aria-label="Nueva propiedad"
          className="flex items-center justify-center rounded-full border border-gray-200 bg-white/90 text-neutral-900 backdrop-blur-md p-1.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full">
            <Plus size={20} />
          </div>
        </Link>
      </div>
    </nav>
  );
}