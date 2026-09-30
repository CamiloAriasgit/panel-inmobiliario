import { createClient } from "@/lib/supabase/server";
import { groupByDay } from "@/lib/utils/group-by-day";
import { getTopProperties } from "@/lib/utils/lead-stats";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminLeadItem } from "@/components/admin/admin-lead-item";
import { LeadsMonthlyChart } from "@/components/admin/leads-monthly-chart";
import { TopPropertiesCard } from "@/components/admin/top-properties-card";
import { LeadsViewToggle } from "@/components/admin/leads-view-toggle";

type SearchParams = { tab?: string };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "stats" ? "stats" : "list";

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, country_code, created_at, property_id, properties(title, images)")
    .order("created_at", { ascending: false });

  const allLeads = leads ?? [];
  const groups = groupByDay(allLeads);
  const topProperties = getTopProperties(allLeads);

  return (
    <div>
      <AdminListHeader title="Leads" />
      <h1 className="mb-4 text-xl text-neutral-900 sm:hidden">Leads</h1>

      <LeadsViewToggle tab={tab} />

      <div className="grid grid-cols-1 gap-6 lg:h-[calc(103vh-140px)] lg:grid-cols-2">
        <div
          className={`${tab === "stats" ? "flex" : "hidden"} min-h-0 flex-col gap-6 lg:flex`}
        >
          <LeadsMonthlyChart leads={allLeads} fill />
          <TopPropertiesCard properties={topProperties} />
        </div>

        <div className={`${tab === "list" ? "block" : "hidden"} min-h-0 lg:block`}>
          <div className="h-full space-y-6 overflow-y-auto pr-1 scrollbar-hide rounded-xl">
            {groups.length === 0 ? (
              <p className="text-sm text-neutral-500">Aún no has recibido leads.</p>
            ) : (
              groups.map((group) => (
                <section key={group.key}>
                  <h2 className="mb-2 px-1 text-sm text-neutral-500">{group.label}</h2>
                  <div className="space-y-1">
                    {group.items.map((lead) => (
                      <AdminLeadItem key={lead.id} lead={lead} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}