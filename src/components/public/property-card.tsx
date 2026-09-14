"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, BedDouble, Bath, Ruler } from "lucide-react";
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
      <article className="overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <Link href={`/propiedades/${property.slug}`}>
          <div className="relative aspect-[4/3]  m-2 overflow-hidden">
            <Image
              src={coverImage}
              alt={property.title}
              fill
              className="object-cover transition rounded-3xl"
            />
            <span
              className="absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs
                         font-medium text-black/70 backdrop:blur-sm"
              style={{ backgroundColor: "white" }}
            >
              {property.listing_type === "venta" ? "Venta" : "Renta"}
            </span>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/propiedades/${property.slug}`}>
            <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900">
              {property.title}
            </h3>
          </Link>

          {property.city && (
            <p className="mb-2 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              {property.neighborhood
                ? `${property.neighborhood}, ${property.city}`
                : property.city}
            </p>
          )}

          <p className="mb-3 text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
            {property.listing_type === "renta" && (
              <span className="text-sm font-normal text-gray-500">/mes</span>
            )}
          </p>

          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={16} />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={16} />
                {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler size={16} />
              {formatArea(property.area_m2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center rounded-full
                       bg-neutral-800 py-3 text-sm font-medium text-white
                       hover:bg-neutral-700"
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