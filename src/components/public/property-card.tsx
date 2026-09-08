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
      <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <Link href={`/propiedades/${property.slug}`}>
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={property.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
            <span
              className="absolute left-3 top-3 rounded-md px-2 py-1 text-xs
                         font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
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

          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
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
            className="flex w-full items-center justify-center gap-2 rounded-lg
                       bg-green-600 py-2.5 text-sm font-medium text-white
                       hover:bg-green-700"
          >
            <MessageCircle size={18} />
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