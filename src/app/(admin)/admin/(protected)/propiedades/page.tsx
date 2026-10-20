import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import {
  getMostViewedProperties,
  getPropertiesNeedingAttention,
  getBestConvertingProperties,
  getViewsReference,
  getConversionMinViews,
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
  const minViews = getConversionMinViews(allProperties);

  return (
    <div>
      {/* Desde sm: título, toggle y acción de crear en una sola fila. El toggle
          va antes del botón para que la acción principal quede en el extremo. */}
      <AdminListHeader
        title="Propiedades"
        createHref="/admin/propiedades/nueva"
        createLabel="Nueva propiedad"
      >
        <AdminViewToggle tab={tab} className="" />
        <Link
          href="/admin/propiedades/nueva"
          aria-label="Nueva propiedad"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 lg:hidden"
        >
          <Plus size={18} />
        </Link>
      </AdminListHeader>

      {/* Móvil: título y, debajo, toggle + crear */}
      <div className="sm:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl text-neutral-900">Propiedades</h1>
        </div>
        <div className="mb-4 flex w-full items-center justify-between">
          <AdminViewToggle tab={tab} className="" />
          <Link
            href="/admin/propiedades/nueva"
            aria-label="Nueva propiedad"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700"
          >
            <Plus size={18} />
          </Link>
        </div>
      </div>

      {tab === "stats" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PropertiesByTypeChart properties={allProperties} />
            <MostViewedPropertiesCard properties={mostViewed} />
          </div>

          <BestConversionCard
            properties={bestConversion}
            referenceViews={referenceViews}
            minViews={minViews}
          />
          <NeedsAttentionCard
            properties={needsAttention}
            referenceViews={referenceViews}
            minViews={minViews}
          />
        </div>
      ) : (
        <div className="">
          {allProperties.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Aún no has agregado ninguna propiedad.
            </p>
          ) : (
            <div className="space-y-2 xl:grid xl:grid-cols-2 xl:gap-2 xl:space-y-0">
              {allProperties.map((property) => (
                <AdminPropertyItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}