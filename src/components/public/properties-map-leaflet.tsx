"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";
import { formatPrice, formatCompactPrice } from "@/lib/utils/format";
import type { Tables } from "@/types/database.types";

function createPriceTagIcon(price: number) {
  const label = formatCompactPrice(price);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: var(--color-primary, #0f172a);
          color: white;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        ">${label}</div>
        <div style="
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid var(--color-primary, #0f172a);
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0], // El transform CSS (-50%, -100%) se encarga del anclaje exacto
    popupAnchor: [0, -35], // Desplaza la ventana emergente (Popup) justo por encima de la etiqueta
  });
}

function MapMarker({ property }: { property: Tables<"properties"> }) {
  const markerRef = useRef<LeafletMarker>(null);
  const coverImage = property.images?.[0] ?? "/placeholder-property.jpg";

  return (
    <Marker
      position={[property.latitude!, property.longitude!]}
      icon={createPriceTagIcon(property.price)}
      ref={markerRef}
    >
      <Popup className="property-popup" closeButton={false} minWidth={220}>
        <div className="relative">
          <button
            type="button"
            onClick={() => markerRef.current?.closePopup()}
            aria-label="Cerrar"
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center
                       justify-center rounded-full bg-white/90 border border-neutral-300"
          >
            <X size={14} />
          </button>

          <div className="relative aspect-[4/3] w-full">
            <Image
              src={coverImage}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {property.listing_type === "venta" ? "Venta" : "Renta"}
              </span>
              <span className="text-[10px] capitalize text-gray-500">
                {property.property_type}
              </span>
            </div>

            <p className="mb-2 line-clamp-1 text-sm font-bold text-gray-900">
              {formatPrice(property.price)}
              {property.listing_type === "renta" && (
                <span className="text-xs font-normal text-gray-500">/mes</span>
              )}
            </p>

            <Link
              href={`/propiedades/${property.slug}`}
              className="flex w-full items-center justify-center rounded-full
                         bg-[var(--color-primary)] py-2 text-xs font-medium !text-white
                         hover:bg-[var(--color-primary)]/80"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function PropertiesMapLeaflet({
  properties,
}: {
  properties: Tables<"properties">[];
}) {
  const withLocation = properties.filter(
    (property) => property.latitude !== null && property.longitude !== null
  );

  const center: [number, number] =
    withLocation.length > 0
      ? [withLocation[0].latitude!, withLocation[0].longitude!]
      : [6.2442, -75.5812];

  return (
    <div className="h-full w-full overflow-hidden rounded-xl">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withLocation.map((property) => (
          <MapMarker key={property.id} property={property} />
        ))}
      </MapContainer>
    </div>
  );
}