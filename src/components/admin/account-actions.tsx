"use client";

import { useRouter } from "next/navigation";
import { Headset, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SUPPORT_WHATSAPP_NUMBER = "573003607632"; // tu número, no el de la agencia

export function AccountActions() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="max-w-md space-y-1">
      <a
        href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-gray-100"
      >
        <Headset size={18} />
        Contactar soporte
      </a>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-gray-100"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  );
}