import { notFound } from "next/navigation";
import Image from "next/image";
import { BedDouble, Bath, Ruler, Car, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brandConfig } from "@/lib/config/brand.config";
import { formatPrice, formatArea } from "@/lib/utils/format";
import { PropertyMap } from "@/components/public/property-map";
import { ShareButton } from "@/components/public/share-button";
import { WhatsappContactButton } from "@/components/public/whatsapp-contact-button";
import { PropertyGallery } from "@/components/public/property-gallery";
import { BackButton } from "@/components/public/back-button";
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

  registerClick(property.id);

  const images = property.images?.length
    ? property.images
    : ["/placeholder-property.jpg"];
  const hasLocation = property.latitude !== null && property.longitude !== null;

  return (
    <>
      <main className="sm:flex sm:h-screen">
        {/* Columna izquierda: contenido, scrollea de forma independiente en desktop */}
        <div className="sm:h-screen sm:w-1/2 sm:overflow-y-auto scrollbar-hide">
          {/* Mobile: carrusel a todo el ancho, hasta el borde superior */}
          {/* Mobile: carrusel cuadrado, sin flechas (gesto de deslizar) */}
          <div className="relative sm:hidden">
            <BackButton />
            <ShareButton title={property.title} slug={property.slug} variant="icon" />
            <PropertyGallery images={images} title={property.title} aspectClassName="aspect-square" />
          </div>

          {/* Desktop: mismo carrusel, con flechas, aspecto más panorámico */}
          <div className="hidden sm:block sm:px-8 sm:pt-8 lg:pl-20 lg:pr-10">
            <BackButton/>
            <PropertyGallery
              images={images}
              title={property.title}
              showArrows
              aspectClassName="aspect-[4/3]"
            />
          </div>

          <div className="px-4 pb-32 pt-4 sm:px-8 sm:pb-8 sm:pt-0 lg:pl-20 lg:pr-10">
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

            {/* Precio visible arriba en mobile (el aside con precio no se muestra ahí) */}
            <p className="mb-4 text-2xl font-bold text-gray-900 sm:hidden">
              {formatPrice(property.price)}
              {property.listing_type === "renta" && (
                <span className="text-sm font-normal text-gray-500">/mes</span>
              )}
            </p>

            {/* Specs: grid 2x2 en mobile, fila en desktop */}
            <div className="mb-6 grid grid-cols-2 gap-3 border-y border-gray-200 py-4 sm:flex sm:items-center sm:gap-6">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-gray-700 sm:bg-transparent sm:p-0">
                  <BedDouble size={20} />
                  <span>{property.bedrooms} hab.</span>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-gray-700 sm:bg-transparent sm:p-0">
                  <Bath size={20} />
                  <span>{property.bathrooms} baños</span>
                </div>
              )}
              {property.parking_spots !== null && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-gray-700 sm:bg-transparent sm:p-0">
                  <Car size={20} />
                  <span>{property.parking_spots} parq.</span>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-gray-700 sm:bg-transparent sm:p-0">
                <Ruler size={20} />
                <span>{formatArea(property.area_m2)}</span>
              </div>
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
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
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

            {/* Mobile: mapa en el flujo normal, a todo el ancho de la pantalla */}
            {hasLocation && (
              <section className="-mx-4 mb-6 sm:hidden">
                <h2 className="mb-2 px-4 font-semibold text-gray-900">
                  Ubicación
                </h2>
                <PropertyMap
                  latitude={property.latitude!}
                  longitude={property.longitude!}
                  className="relative isolate h-72 w-full"
                />
              </section>
            )}

            {/* Desktop: precio + contacto + compartir, en el flujo de la columna izquierda */}
            <div className="hidden sm:sticky sm:top-8 sm:mt-8 sm:block sm:rounded-xl sm:border sm:border-gray-200 sm:p-5 sm:shadow-sm">
              <p className="mb-4 text-2xl font-bold text-gray-900">
                {formatPrice(property.price)}
                {property.listing_type === "renta" && (
                  <span className="text-sm font-normal text-gray-500">/mes</span>
                )}
              </p>
              <WhatsappContactButton property={property} />
              <div className="mt-3">
                <ShareButton title={property.title} slug={property.slug} />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: mapa a pantalla completa, sin margen, hasta el borde derecho */}
        <div className="relative isolate hidden sm:block sm:h-screen sm:w-1/2">
          {hasLocation ? (
            <PropertyMap
              latitude={property.latitude!}
              longitude={property.longitude!}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
              Ubicación no disponible
            </div>
          )}
        </div>
      </main>

      {/* Mobile: botón de contacto fijo en la base de la pantalla */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white via-white/80 to-transparent p-4 sm:hidden">
        <WhatsappContactButton property={property} />
      </div>
    </>
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