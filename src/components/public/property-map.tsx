"use client";

import dynamic from "next/dynamic";

const PropertyMapLeaflet = dynamic(
  () => import("./property-map-leaflet").then((mod) => mod.PropertyMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-64 items-center justify-center bg-gray-100 text-sm text-gray-500">
        Cargando mapa...
      </div>
    ),
  }
);

export function PropertyMap({
  latitude,
  longitude,
  className = "h-64 w-full rounded-xl",
}: {
  latitude: number;
  longitude: number;
  className?: string;
}) {
  return (
    <PropertyMapLeaflet
      latitude={latitude}
      longitude={longitude}
      className={className}
    />
  );
}