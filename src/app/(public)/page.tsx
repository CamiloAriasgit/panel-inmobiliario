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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-6 space-y-4">
        <SearchBar defaultValue={params.q} />
        <FilterPanel currentFilters={params} />
      </section>

      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-300 p-1">
          <ViewToggleLink view="list" currentView={view} icon={List} label="Lista" />
          <ViewToggleLink view="map" currentView={view} icon={MapIcon} label="Mapa" />
        </div>
      </div>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No encontramos propiedades con esos criterios.
        </p>
      ) : view === "map" ? (
        <PropertiesMapView properties={properties} />
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      )}
    </main>
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
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
        currentView === view
          ? "bg-[var(--color-primary)] text-white"
          : "text-gray-600"
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
    query = query.eq("property_type", params.property_type);
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