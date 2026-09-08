"use client";

import dynamic from "next/dynamic";

const PropertyMapLeaflet = dynamic(
  () => import("./property-map-leaflet").then((mod) => mod.PropertyMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
        Cargando mapa...
      </div>
    ),
  }
);

export function PropertyMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return <PropertyMapLeaflet latitude={latitude} longitude={longitude} />;
}