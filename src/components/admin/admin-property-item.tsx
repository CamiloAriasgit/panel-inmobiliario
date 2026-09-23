"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Pencil, MousePointerClick } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { PropertyStatusBadge } from "./property-status-badge";
import { DeletePropertyButton } from "./delete-property-button";
import type { Tables } from "@/types/database.types";

type PropertyListItem = Pick<
  Tables<"properties">,
  "id" | "title" | "price" | "listing_type" | "status" | "click_count" | "images"
>;

export function AdminPropertyItem({ property }: { property: PropertyListItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const coverImage = property.images?.[0] ?? "/placeholder-property.jpg";

  const metaRow = (
    <div className="flex items-center gap-2">
      <PropertyStatusBadge status={property.status} />
      <span className="text-xs capitalize text-neutral-500">
        {property.listing_type}
      </span>
      <span className="flex items-center gap-1 text-xs text-neutral-500">
        <MousePointerClick size={12} />
        {property.click_count}
      </span>
    </div>
  );

  return (
    <>
      {/* Mobile: fila colapsable (acordeón) */}
      <div className="rounded-2xl border border-gray-200 sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center gap-3 p-3 text-left"
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image src={coverImage} alt={property.title} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-900">
              {property.title}
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatPrice(property.price)}
            </p>
          </div>
          <ChevronDown
            size={18}
            className={`shrink-0 text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="space-y-3 border-t border-gray-100 p-3">
            {metaRow}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/propiedades/${property.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-sm font-medium text-neutral-700"
              >
                <Pencil size={14} />
                Editar
              </Link>
              <DeletePropertyButton propertyId={property.id} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop: card horizontal */}
      <div className="hidden rounded-3xl border border-gray-200 p-3 sm:flex sm:gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image src={coverImage} alt={property.title} fill className="object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="truncate font-medium text-neutral-900">{property.title}</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {metaRow}
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/propiedades/${property.id}`}
                className="rounded-lg p-2 text-neutral-500 hover:bg-gray-100"
              >
                <Pencil size={16} />
              </Link>
              <DeletePropertyButton propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}