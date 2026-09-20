"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { getCountryByIso } from "@/lib/data/country-codes";

type CreateLeadInput = {
  propertyId: string;
  agencyId: string;
  name: string;
  phone: string;
  countryIso: string;
  acceptedPrivacyPolicy: boolean;
};

type CreateLeadResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string };

export async function createLead(
  input: CreateLeadInput
): Promise<CreateLeadResult> {
  const name = input.name.trim();

  if (name.length < 2) {
    return { success: false, error: "Nombre inválido." };
  }

  const localDigits = input.phone.trim().replace(/\D/g, "");
  if (localDigits.length < 7) {
    return { success: false, error: "Número de teléfono inválido." };
  }

  if (!input.acceptedPrivacyPolicy) {
    return {
      success: false,
      error: "Debes aceptar la Política de Tratamiento de Datos.",
    };
  }

  // El código de marcado se resuelve en el servidor a partir del ISO
  // (no se confía en un dialCode que pudiera venir manipulado desde
  // el navegador) — el ISO solo selecciona una entrada de una lista
  // fija que tú controlas.
  const country = getCountryByIso(input.countryIso);
  const fullPhoneDigits = `${country.dialCode}${localDigits}`;

  const supabase = createServiceClient();

    const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, title, slug, agency_id, agencies(whatsapp_number)")
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
    phone: fullPhoneDigits,
    country_code: country.iso,
    privacy_accepted_at: new Date().toISOString(),
  });

  if (insertError) {
    return { success: false, error: "No se pudo registrar el lead." };
  }

  const agencyWhatsapp = property.agencies.whatsapp_number;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const propertyUrl = `${protocol}://${host}/propiedades/${property.slug}`;

  const message = encodeURIComponent(
    `Hola, soy ${name}. Estoy interesado(a) en la propiedad "${property.title}".\n${propertyUrl}`
  );
  const whatsappUrl = `https://wa.me/${agencyWhatsapp}?text=${message}`;

  return { success: true, whatsappUrl };
}