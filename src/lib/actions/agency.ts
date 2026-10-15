"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCountryByIso } from "@/lib/data/country-codes";
import { revalidatePath } from "next/cache";

export async function updateAgencyWhatsapp(
  countryIso: string,
  localNumber: string
): Promise<{ success: boolean; error?: string }> {
  const localDigits = localNumber.replace(/\D/g, "");

  if (localDigits.length < 7) {
    return { success: false, error: "Número de WhatsApp inválido." };
  }

  const country = getCountryByIso(countryIso);
  const fullNumber = `${country.dialCode}${localDigits}`;

  // La agencia se resuelve desde la sesión real del admin (cliente normal,
  // con RLS), nunca desde un dato enviado por el formulario.
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

  // Con el agencyId ya verificado, service_role actualiza EXCLUSIVAMENTE
  // whatsapp_number.
  const serviceClient = createServiceClient();
  const { error } = await serviceClient
    .from("agencies")
    .update({ whatsapp_number: fullNumber })
    .eq("id", profile.agency_id);

  if (error) {
    return { success: false, error: "No se pudo actualizar el número." };
  }

  revalidatePath("/admin/configuracion");
  return { success: true };
}