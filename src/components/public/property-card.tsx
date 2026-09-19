"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils/format";
import { WhatsappLeadModal } from "./whatsapp-lead-modal";
import type { Tables } from "@/types/database.types";

export function PropertyCard({
  property,
}: {
  property: Tables<"properties">;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const coverImage = property.images?.[0] ?? "/placeholder-property.jpg";

  return (
    <>
      <article className="relative overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        {/* z-10 explícito: ahora sí gana el "empate" de pintado contra
            los contenedores de imagen/contenido que vienen después en
            el HTML, aunque estos tengan `relative` sin z-index propio. */}
        <Link
          href={`/propiedades/${property.slug}`}
          className="absolute inset-0 z-10"
          aria-label={property.title}
        />

        {/* Ya no necesita `relative`: no tiene hijos absolutos propios
            aparte de la insignia, que sigue funcionando igual porque
            sigue estando dentro de un contenedor con `relative`. */}
        <div className="relative aspect-[4/3] m-2 overflow-hidden">
          <Image
            src={coverImage}
            alt={property.title}
            fill
            className="pointer-events-none object-cover transition rounded-3xl"
          />
          <span
            className="absolute bg-white/70 left-3 top-3 rounded-full px-3 py-1.5 text-xs
                       font-medium text-black/70 backdrop-blur-md border border-white/60"
          >
            {property.listing_type === "venta" ? "Venta" : "Renta"}
          </span>
        </div>

        {/* Sin `relative`: no tiene ningún hijo con `position: absolute`
            propio, así que no necesitaba generar su propio nivel de
            apilamiento — era justamente lo que estaba tapando el link. */}
        <div className="p-4">
          <p className="mb-1 text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
            {property.listing_type === "renta" && (
              <span className="text-sm font-normal text-gray-500">/mes</span>
            )}
          </p>

          <h3 className="mb-1 line-clamp-1 text-sm font-medium text-gray-700">
            {property.title}
          </h3>

          {property.city && (
            <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              {property.neighborhood
                ? `${property.neighborhood}, ${property.city}`
                : property.city}
            </p>
          )}

          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={16} />
                {property.bedrooms} Hab.
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={16} />
                {property.bathrooms} Baños
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler size={16} />
              {formatArea(property.area_m2)}
            </span>
          </div>

          {/* z-20: gana tanto al link (z-10) como a cualquier otro
              elemento, garantizando que el botón siempre sea clickeable
              de forma independiente al link de fondo. */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="relative z-20 flex w-full items-center justify-center rounded-full
                       bg-[var(--color-primary)] py-3 text-sm font-medium text-white
                       hover:bg-[var(--color-primary)]/80"
          >
            Contactar por WhatsApp
          </button>
        </div>
      </article>

      {isModalOpen && (
        <WhatsappLeadModal
          property={property}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}