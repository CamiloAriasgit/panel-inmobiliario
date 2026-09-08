"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteProperty(
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // No se usa el cliente de service_role aquí a propósito: este
  // cliente respeta la sesión del admin autenticado, así que RLS
  // ("admin gestiona propiedades de su agencia") ya garantiza que
  // solo puede borrar propiedades de su propia agencia. Si alguien
  // manipulara el propertyId para apuntar a otra agencia, la
  // eliminación simplemente no afectaría ninguna fila.
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    return { success: false, error: "No se pudo eliminar la propiedad." };
  }

  revalidatePath("/admin/propiedades");
  return { success: true };
}

export type PropertyFormInput = {
  title: string;
  slug: string;
  description: string;
  listingType: "venta" | "renta";
  propertyType: string;
  status: "draft" | "published" | "archived";
  price: number;
  areaM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  address: string | null;
  city: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  conditions: string | null;
  images: string[];
};

async function getAuthenticatedAgencyId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  return profile?.agency_id ?? null;
}

export async function createProperty(
  id: string,
  input: PropertyFormInput
): Promise<{ success: boolean; propertyId?: string; error?: string }> {
  const supabase = await createClient();
  const agencyId = await getAuthenticatedAgencyId(supabase);

  if (!agencyId) {
    return { success: false, error: "No autenticado." };
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      id, // <- se usa el mismo id que ya se usó para subir las imágenes
      agency_id: agencyId,
      title: input.title,
      slug: input.slug,
      description: input.description,
      listing_type: input.listingType,
      property_type: input.propertyType,
      status: input.status,
      price: input.price,
      area_m2: input.areaM2,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      parking_spots: input.parkingSpots,
      address: input.address,
      city: input.city,
      neighborhood: input.neighborhood,
      latitude: input.latitude,
      longitude: input.longitude,
      features: input.features,
      conditions: input.conditions,
      images: input.images,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "No se pudo crear la propiedad." };
  }

  revalidatePath("/admin/propiedades");
  return { success: true, propertyId: data.id };
}

export async function updateProperty(
  propertyId: string,
  input: PropertyFormInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("properties")
    .update({
      title: input.title,
      slug: input.slug,
      description: input.description,
      listing_type: input.listingType,
      property_type: input.propertyType,
      status: input.status,
      price: input.price,
      area_m2: input.areaM2,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      parking_spots: input.parkingSpots,
      address: input.address,
      city: input.city,
      neighborhood: input.neighborhood,
      latitude: input.latitude,
      longitude: input.longitude,
      features: input.features,
      conditions: input.conditions,
      images: input.images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId);

  if (error) {
    return { success: false, error: "No se pudo actualizar la propiedad." };
  }

  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${propertyId}`);
  return { success: true };
}