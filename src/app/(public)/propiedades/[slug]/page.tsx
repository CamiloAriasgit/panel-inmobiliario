import { notFound } from "next/navigation";
import Image from "next/image";
import { BedDouble, Bath, Ruler, Car, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brandConfig } from "@/lib/config/brand.config";
import { formatPrice, formatArea } from "@/lib/utils/format";
import { PropertyMap } from "@/components/public/property-map";
import { ShareButton } from "@/components/public/share-button";
import { WhatsappContactButton } from "@/components/public/whatsapp-contact-button";
import type { Metadata } from "next";
import type { Tables } from "@/types/database.types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return { title: "Propiedad no encontrada" };
  }

  return {
    title: property.title,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  // Se registra el clic al cargar el detalle. No se espera (await)
  // el resultado a propósito: si falla, no debe bloquear ni retrasar
  // la carga de la página para el visitante.
  registerClick(property.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(property.images?.length ? property.images : ["/placeholder-property.jpg"]).map(
          (image, index) => (
            <div
              key={image + index}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl ${
                index === 0 ? "sm:col-span-2 sm:aspect-[16/9]" : ""
              }`}
            >
              <Image
                src={image}
                alt={`${property.title} - foto ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-md px-2 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {property.listing_type === "venta" ? "Venta" : "Renta"}
            </span>
            <span className="text-sm capitalize text-gray-500">
              {property.property_type}
            </span>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {property.title}
          </h1>

          {property.city && (
            <p className="mb-4 flex items-center gap-1 text-gray-500">
              <MapPin size={16} />
              {[property.address, property.neighborhood, property.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}

          <div className="mb-6 flex items-center gap-6 border-y border-gray-200 py-4 text-gray-700">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-2">
                <BedDouble size={20} /> {property.bedrooms} hab.
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-2">
                <Bath size={20} /> {property.bathrooms} baños
              </span>
            )}
            {property.parking_spots !== null && (
              <span className="flex items-center gap-2">
                <Car size={20} /> {property.parking_spots} parqueaderos
              </span>
            )}
            <span className="flex items-center gap-2">
              <Ruler size={20} /> {formatArea(property.area_m2)}
            </span>
          </div>

          <section className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-900">Descripción</h2>
            <p className="whitespace-pre-line text-gray-700">
              {property.description}
            </p>
          </section>

          {property.features && property.features.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-2 font-semibold text-gray-900">
                Características
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {property.conditions && (
            <section className="mb-6">
              <h2 className="mb-2 font-semibold text-gray-900">
                Condiciones
              </h2>
              <p className="whitespace-pre-line text-gray-700">
                {property.conditions}
              </p>
            </section>
          )}

          {property.latitude && property.longitude && (
            <section>
              <h2 className="mb-2 font-semibold text-gray-900">Ubicación</h2>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="mb-4 text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
              {property.listing_type === "renta" && (
                <span className="text-sm font-normal text-gray-500">/mes</span>
              )}
            </p>

            <WhatsappContactButton property={property} />

            <div className="mt-3">
              <ShareButton
                title={property.title}
                slug={property.slug}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

async function getProperty(
  slug: string
): Promise<Tables<"properties"> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("agency_id", brandConfig.agencyId)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function registerClick(propertyId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_property_click", {
    p_property_id: propertyId,
  });
}