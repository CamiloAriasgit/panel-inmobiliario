import { createClient } from "@/lib/supabase/server";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminLeadItem } from "@/components/admin/admin-lead-item";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, created_at, properties(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminListHeader title="Leads" />
      <h1 className="mb-4 text-xl text-neutral-900 sm:hidden">Leads</h1>

      {!leads || leads.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no has recibido leads.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <AdminLeadItem key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}