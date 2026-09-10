import { List, Map as MapIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brandConfig } from "@/lib/config/brand.config";
import { SearchBar } from "@/components/public/search-bar";
import { FilterPanel } from "@/components/public/filter-panel";
import { PropertyCard } from "@/components/public/property-card";
import { PropertiesMapView } from "@/components/public/properties-map-view";
import type { Tables } from "@/types/database.types";

type SearchParams = {
  q?: string;
  view?: "list" | "map";
  listing_type?: "venta" | "renta";
  property_type?: string;
  city?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const properties = await getProperties(params);
  const view = params.view === "map" ? "map" : "list";

  return (
    <main className="mx-auto px-4 lg:px-20 py-8 pb-28 sm:pb-8">
      <section className="mb-6 flex items-start justify-center gap-1">
        <SearchBar defaultValue={params.q} />
        <FilterPanel currentFilters={params} />
      </section>

      {/* Desktop: pill inline, alineada a la derecha, como antes */}
      <div className="mb-4 hidden justify-end sm:flex">
        <ViewTogglePill view={view} />
      </div>

      {/* Mobile: pill fija sobre la barra inferior del navegador, con blur */}
      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center sm:hidden">
        <ViewTogglePill view={view} />
      </div>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No encontramos propiedades con esos criterios.
        </p>
      ) : view === "map" ? (
        <PropertiesMapView properties={properties} />
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      )}
    </main>
  );
}

function ViewTogglePill({ view }: { view: "list" | "map" }) {
  return (
    <div
      className="inline-flex rounded-full border border-neutral-700
                 bg-black/70 p-1 shadow-lg backdrop-blur-md"
    >
      <ViewToggleLink view="list" currentView={view} icon={List} label="Lista" />
      <ViewToggleLink view="map" currentView={view} icon={MapIcon} label="Mapa" />
    </div>
  );
}

function ViewToggleLink({
  view,
  currentView,
  icon: Icon,
  label,
}: {
  view: "list" | "map";
  currentView: "list" | "map";
  icon: typeof List;
  label: string;
}) {
  return (
    <a
      href={`?view=${view}`}
      className={`flex items-center gap-1.5 rounded-full px-4 py-3 text-sm ${
        currentView === view
          ? "bg-white text-black"
          : "text-neutral-300"
      }`}
    >
      <Icon size={16} />
      {label}
    </a>
  );
}

async function getProperties(
  params: SearchParams
): Promise<Tables<"properties">[]> {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("agency_id", brandConfig.agencyId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (params.q && params.q.trim().length > 0) {
    const words = params.q.trim().split(/\s+/);
    for (const word of words) {
      query = query.or(`title.ilike.%${word}%,description.ilike.%${word}%`);
    }
  }

  if (params.listing_type) {
    query = query.eq("listing_type", params.listing_type);
  }

  if (params.property_type) {
    const types = params.property_type.split(",").filter(Boolean);
    if (types.length > 0) {
      query = query.in("property_type", types);
    }
  }

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  if (params.min_price) {
    query = query.gte("price", Number(params.min_price));
  }

  if (params.max_price) {
    query = query.lte("price", Number(params.max_price));
  }

  if (params.min_area) {
    query = query.gte("area_m2", Number(params.min_area));
  }

  if (params.max_area) {
    query = query.lte("area_m2", Number(params.max_area));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar propiedades:", error.message);
    return [];
  }

  return data;
}