"use server";

import { createServiceClient } from "@/lib/supabase/service";

type CreateLeadInput = {
  propertyId: string;
  agencyId: string;
  name: string;
  phone: string;
  acceptedPrivacyPolicy: boolean; // <- nuevo
};

type CreateLeadResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string };

export async function createLead(
  input: CreateLeadInput
): Promise<CreateLeadResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();

  if (name.length < 2) {
    return { success: false, error: "Nombre inválido." };
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return { success: false, error: "Número de teléfono inválido." };
  }

  // Validación en el servidor, no solo en el checkbox del navegador:
  // sin este control, alguien podría llamar a este server action
  // directamente (saltándose la UI) y crear un lead sin consentimiento.
  if (!input.acceptedPrivacyPolicy) {
    return {
      success: false,
      error: "Debes aceptar la Política de Tratamiento de Datos.",
    };
  }

  const supabase = createServiceClient();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, title, agency_id, agencies(whatsapp_number)")
    .eq("id", input.propertyId)
    .eq("agency_id", input.agencyId)
    .eq("status", "published")
    .single();

  if (propertyError || !property) {
    return { success: false, error: "Propiedad no encontrada." };
  }

  const { error: insertError } = await supabase.from("leads").insert({
    agency_id: input.agencyId,
    property_id: input.propertyId,
    name,
    phone: phoneDigits,
    privacy_accepted_at: new Date().toISOString(),
  });

  if (insertError) {
    return { success: false, error: "No se pudo registrar el lead." };
  }

  const agencyWhatsapp = property.agencies.whatsapp_number;
  const message = encodeURIComponent(
    `Hola, soy ${name}. Estoy interesado(a) en la propiedad "${property.title}".`
  );
  const whatsappUrl = `https://wa.me/${agencyWhatsapp}?text=${message}`;

  return { success: true, whatsappUrl };
}