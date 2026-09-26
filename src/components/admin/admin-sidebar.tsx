"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/lib/config/brand.config";
import { NAV_ITEMS } from "./nav-items";

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-white p-4 m-4 rounded-2xl sm:flex">
      <div className="mb-6 px-2">
        <p className="font-semibold text-neutral-900">{brandConfig.name}</p>
        <p className="truncate text-xs text-neutral-500">{adminName}</p>
      </div>

      <nav className="flex-1 space-y-1">
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
    </aside>
  );
}