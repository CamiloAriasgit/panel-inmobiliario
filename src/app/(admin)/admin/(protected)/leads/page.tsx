import { createClient } from "@/lib/supabase/server";
import { groupByDay } from "@/lib/utils/group-by-day";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminLeadItem } from "@/components/admin/admin-lead-item";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

    const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, country_code, created_at, properties(title, images)")
    .order("created_at", { ascending: false });

  const groups = groupByDay(leads ?? []);

  return (
    <div>
      <AdminListHeader title="Leads" />
      <h1 className="mb-4 text-xl text-neutral-900 sm:hidden">Leads</h1>

      {groups.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no has recibido leads.</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="mb-2 px-1 text-sm text-neutral-500">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map((lead) => (
                  <AdminLeadItem key={lead.id} lead={lead} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}