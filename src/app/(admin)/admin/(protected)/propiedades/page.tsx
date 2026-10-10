import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getMostViewedProperties,
  getPropertiesNeedingAttention,
  getBestConvertingProperties,
  getViewsReference,
} from "@/lib/utils/property-stats";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminPropertyItem } from "@/components/admin/admin-property-item";
import { AdminViewToggle } from "@/components/admin/admin-view-toggle";
import { PropertiesByTypeChart } from "@/components/admin/properties-by-type-chart";
import { MostViewedPropertiesCard } from "@/components/admin/most-viewed-properties-card";
import { NeedsAttentionCard } from "@/components/admin/needs-attention-card";
import { BestConversionCard } from "@/components/admin/best-conversion-card";

type SearchParams = { tab?: string };

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "stats" ? "stats" : "list";

  const supabase = await createClient();

  const [{ data: properties }, { data: leads }] = await Promise.all([
    supabase
      .from("properties")
      .select("id, title, price, listing_type, property_type, status, click_count, images")
      .order("created_at", { ascending: false }),
    supabase.from("leads").select("property_id"),
  ]);

  const allProperties = properties ?? [];

  const leadCountsByProperty = new Map<string, number>();
  for (const lead of leads ?? []) {
    if (!lead.property_id) continue;
    leadCountsByProperty.set(
      lead.property_id,
      (leadCountsByProperty.get(lead.property_id) ?? 0) + 1
    );
  }

  const mostViewed = getMostViewedProperties(allProperties);
  const needsAttention = getPropertiesNeedingAttention(allProperties, leadCountsByProperty);
  const bestConversion = getBestConvertingProperties(allProperties, leadCountsByProperty);
  const referenceViews = getViewsReference(bestConversion, needsAttention);

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

      {/* Fila superior: panorama general del inventario (60% del alto en desktop) */}
      <div className="grid grid-cols-1 gap-6 lg:h-[calc(90vh-140px)] lg:grid-cols-2">
        <div
          className={`${tab === "stats" ? "flex" : "hidden"} min-h-0 flex-col gap-6 overflow-y-auto pr-1 scrollbar-hide lg:flex`}
        >
          <PropertiesByTypeChart properties={allProperties} />
          <MostViewedPropertiesCard properties={mostViewed} />
        </div>

        <div className={`${tab === "list" ? "block" : "hidden"} min-h-0 lg:block`}>
          <div className="h-full overflow-y-auto pr-1 scrollbar-hide lg:bg-white rounded-xl">
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

      {/* Fila inferior: casos accionables de conversión (40% del alto, solo estadísticas) */}
      <div
        className={`${tab === "stats" ? "grid" : "hidden"} mt-6 grid-cols-1 gap-6 lg:grid lg:h-[calc(60vh-40px)] lg:grid-cols-2`}
      >
        <div className="min-h-0 overflow-y-auto pr-1 scrollbar-hide">
          <BestConversionCard properties={bestConversion} referenceViews={referenceViews} />
        </div>
        <div className="min-h-0 overflow-y-auto pr-1 scrollbar-hide">
          <NeedsAttentionCard properties={needsAttention} referenceViews={referenceViews} />
        </div>
      </div>
    </div>
  );
}