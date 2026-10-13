"use client";

import { useRouter } from "next/navigation";
import { Headset, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SUPPORT_WHATSAPP_NUMBER = "573003607632"; 

export function AccountActions({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className={`w-full ${isCollapsed ? "space-y-1 flex flex-col items-center" : "max-w-md space-y-1"}`}>
      <a
        href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        title={isCollapsed ? "Contactar soporte" : undefined}
        className={`flex items-center gap-3 rounded-lg text-sm font-medium text-neutral-700 transition-colors ${
          isCollapsed 
            ? "h-10 w-10 justify-center p-0 hover:bg-gray-300/70" 
            : "px-3 py-2.5 md:bg-white md:mb-2 w-full hover:bg-gray-100"
        }`}
      >
        <Headset size={18} className="shrink-0" />
        <span className={isCollapsed ? "hidden" : "inline"}>Contactar soporte</span>
      </a>

      <button
        type="button"
        onClick={handleLogout}
        title={isCollapsed ? "Cerrar sesión" : undefined}
        className={`flex items-center gap-3 rounded-lg text-sm font-medium text-neutral-700 transition-colors ${
          isCollapsed 
            ? "h-10 w-10 justify-center p-0 hover:bg-gray-300/70" 
            : "w-full px-3 py-2.5 md:bg-white hover:bg-gray-100"
        }`}
      >
        <LogOut size={18} className="shrink-0" />
        <span className={isCollapsed ? "hidden" : "inline"}>Cerrar sesión</span>
      </button>
    </div>
  );
}