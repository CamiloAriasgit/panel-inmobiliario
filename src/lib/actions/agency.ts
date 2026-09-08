"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function updateAgencyWhatsapp(
  whatsappNumber: string
): Promise<{ success: boolean; error?: string }> {
  const digits = whatsappNumber.replace(/\D/g, "");

  if (digits.length < 10) {
    return { success: false, error: "Número de WhatsApp inválido." };
  }

  // Se resuelve la agencia desde la sesión real del admin (cliente
  // normal, con RLS) — nunca se confía en un agencyId enviado desde
  // el formulario.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Perfil no encontrado." };
  }

  // Solo aquí, ya con el agencyId verificado desde la sesión, se usa
  // service_role para actualizar EXCLUSIVAMENTE whatsapp_number.
  const serviceClient = createServiceClient();
  const { error } = await serviceClient
    .from("agencies")
    .update({ whatsapp_number: digits })
    .eq("id", profile.agency_id);

  if (error) {
    return { success: false, error: "No se pudo actualizar el número." };
  }

  revalidatePath("/admin/configuracion");
  return { success: true };
}