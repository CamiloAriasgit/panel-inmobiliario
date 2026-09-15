"use client";

import dynamic from "next/dynamic";
import type { Tables } from "@/types/database.types";

const PropertiesMapLeaflet = dynamic(
  () =>
    import("./properties-map-leaflet").then((mod) => mod.PropertiesMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
        Cargando mapa...
      </div>
    ),
  }
);

export function PropertiesMapView({
  properties,
}: {
  properties: Tables<"properties">[];
}) {
  return <PropertiesMapLeaflet properties={properties} />;
}