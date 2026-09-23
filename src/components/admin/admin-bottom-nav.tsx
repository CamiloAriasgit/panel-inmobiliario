"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 pb-4 z-30 flex justify-center sm:hidden bg-gradient-to-b from-transparent via-white/80 to-white "
      aria-label="Navegación principal"
    >
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
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-neutral-500"
              }`}
            >
              <item.icon size={20} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}