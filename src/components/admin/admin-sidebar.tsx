"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, ChevronLeft, ChevronRight, User } from "lucide-react";
import { brandConfig } from "@/lib/config/brand.config";
import { NAV_ITEMS } from "./nav-items";
import { AccountActions } from "./account-actions";

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  }, []);

  return (
    <aside
      className={`sticky top-0 hidden shrink-0 p-2 pr-0 sm:flex sm:flex-col transition-all duration-300 relative ${isCollapsed ? "h-screen justify-center w-[4.2rem]" : "h-screen w-[16.5rem]"
        }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-neutral-700 border-4 border-gray-300 hover:bg-gray-100 transition-transform"
        title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`relative flex flex-col overflow-y-auto rounded-2xl bg-gray-200 p-4 scrollbar-hide transition-all duration-300 ${isCollapsed ? "h-2/3 py-2 px-2 items-center" : "h-full"
          }`}
      >

        <div className={`flex items-center mb-6 pr-2 transition-opacity duration-200 ${isCollapsed ? "opacity-0 pointer-events-none hidden" : "opacity-100"}`}>
          <div className="bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-primary)]/60 to-[var(--color-primary)] text-white p-3 rounded-full mr-2 shadow-inner shadow-[var(--color-primary)]">
            <User className="" size={16}/>
            </div>
          <div>
            <p className="font-semibold text-neutral-900">{brandConfig.name}</p>
            <p className="truncate text-xs text-neutral-500">{adminName}</p>
          </div>
        </div>

        <nav className={`space-y-1 ${isCollapsed ? "w-full flex flex-col items-center" : ""}`}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-600 hover:bg-gray-300/70"
                  } ${isCollapsed
                    ? "h-11 w-11 justify-center p-0"
                    : "px-3 py-2"
                  }`}
              >
                <item.icon size={18} className="shrink-0" />
                <span className={`${isCollapsed ? "hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <p className={`mb-1 mt-6 px-3 text-xs text-neutral-400 ${isCollapsed ? "hidden" : "block"}`}>
          Acción rápida
        </p>
        <Link
          href="/admin/propiedades/nueva"
          title={isCollapsed ? "Nueva propiedad" : undefined}
          className={`flex items-center gap-3 rounded-full bg-white text-sm font-medium text-neutral-600 hover:bg-gray-100 ${isCollapsed
              ? "mt-6 h-11 w-11 justify-center p-0"
              : "px-1.5 py-1.5 pl-4"
            }`}
        >
          <span className={`flex-1 ${isCollapsed ? "hidden" : "inline"}`}>Nueva propiedad</span>
          <div className={`${isCollapsed ? "flex items-center justify-center" : "rounded-full bg-gray-200 p-2"}`}>
            <Plus size={18} />
          </div>
        </Link>

        <div className={`mt-auto w-full ${isCollapsed ? "bg-transparent p-0 pt-6 flex flex-col items-center space-y-1" : "rounded-lg bg-white p-5"}`}>
          {!isCollapsed && <h2 className="mb-1 text-neutral-900">Cuenta</h2>}
          <AccountActions isCollapsed={isCollapsed} />
        </div>

      </div>
    </aside>
  );
}