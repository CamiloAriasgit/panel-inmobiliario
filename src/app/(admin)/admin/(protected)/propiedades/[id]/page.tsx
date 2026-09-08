import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormInput } from "@/lib/actions/properties";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // No se filtra agency_id manualmente: RLS ("admin gestiona
  // propiedades de su agencia") ya impide que este admin vea una
  // propiedad que no sea suya, aunque conozca el id exacto por URL.
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  const initialData: PropertyFormInput = {
    title: property.title,
    slug: property.slug,
    description: property.description,
    listingType: property.listing_type,
    propertyType: property.property_type,
    status: property.status,
    price: property.price,
    areaM2: property.area_m2,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkingSpots: property.parking_spots,
    address: property.address,
    city: property.city,
    neighborhood: property.neighborhood,
    latitude: property.latitude,
    longitude: property.longitude,
    features: property.features ?? [],
    conditions: property.conditions,
    images: property.images ?? [],
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Editar propiedad
      </h1>
      <PropertyForm mode="edit" propertyId={property.id} initialData={initialData} />
    </div>
  );
}