"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const brandMarkerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
    background: var(--color-primary, #0f172a);
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export function PropertyMapLeaflet({
  latitude,
  longitude,
  className,
}: {
  latitude: number;
  longitude: number;
  className: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={brandMarkerIcon} />
      </MapContainer>
    </div>
  );
}