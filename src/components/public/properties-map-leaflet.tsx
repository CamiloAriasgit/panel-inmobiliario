"use client";

import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/utils/format";
import type { Tables } from "@/types/database.types";

const brandMarkerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 26px; height: 26px; border-radius: 50% 50% 50% 0;
    background: var(--color-primary, #0f172a);
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

export function PropertiesMapLeaflet({
  properties,
}: {
  properties: Tables<"properties">[];
}) {
  const router = useRouter();

  const withLocation = properties.filter(
    (property) => property.latitude !== null && property.longitude !== null
  );

  // Centro por defecto (Medellín) si ninguna propiedad tiene ubicación
  // cargada todavía, para que el mapa no quede en blanco/roto.
  const center: [number, number] =
    withLocation.length > 0
      ? [withLocation[0].latitude!, withLocation[0].longitude!]
      : [6.2442, -75.5812];

  return (
    <div className="h-full w-full overflow-hidden">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withLocation.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
            icon={brandMarkerIcon}
            eventHandlers={{
              click: () => router.push(`/propiedades/${property.slug}`),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="mb-1 font-medium">{property.title}</p>
                <p className="text-gray-600">{formatPrice(property.price)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}