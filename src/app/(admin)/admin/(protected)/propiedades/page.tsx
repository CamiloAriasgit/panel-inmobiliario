import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMostViewedProperties } from "@/lib/utils/property-stats";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminPropertyItem } from "@/components/admin/admin-property-item";
import { AdminViewToggle } from "@/components/admin/admin-view-toggle";
import { PropertiesByTypeChart } from "@/components/admin/properties-by-type-chart";
import { MostViewedPropertiesCard } from "@/components/admin/most-viewed-properties-card";

type SearchParams = { tab?: string };

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "stats" ? "stats" : "list";

  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, price, listing_type, property_type, status, click_count, images")
    .order("created_at", { ascending: false });

  const allProperties = properties ?? [];
  const mostViewed = getMostViewedProperties(allProperties);

  return (
    <div>
      <AdminListHeader
        title="Propiedades"
        createHref="/admin/propiedades/nueva"
        createLabel="Nueva propiedad"
      />

      <div className="mb-4 flex items-center justify-between sm:hidden">
        <h1 className="text-xl text-neutral-900">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          aria-label="Nueva propiedad"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
        >
          <Plus size={18} />
        </Link>
      </div>

      <AdminViewToggle tab={tab} />

      <div className="grid grid-cols-1 gap-6 lg:h-[calc(100vh-140px)] lg:grid-cols-2">
        {/* Izquierda: estadísticas */}
        <div className={`${tab === "stats" ? "flex" : "hidden"} min-h-0 flex-col gap-6 lg:flex`}>
          <PropertiesByTypeChart properties={allProperties} fill />
          <MostViewedPropertiesCard properties={mostViewed} />
        </div>

        {/* Derecha: propiedades, con scroll propio de altura completa */}
        <div className={`${tab === "list" ? "block" : "hidden"} min-h-0 lg:block`}>
          <div className="h-full overflow-y-auto pr-1 scrollbar-hide">
            {allProperties.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aún no has agregado ninguna propiedad.
              </p>
            ) : (
              <div className="space-y-1">
                {allProperties.map((property) => (
                  <AdminPropertyItem key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}