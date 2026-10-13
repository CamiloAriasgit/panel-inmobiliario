import Link from "next/link";
import { Building2, Eye, Users, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { groupByDay } from "@/lib/utils/group-by-day";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminLeadItem } from "@/components/admin/admin-lead-item";
import { StatTile } from "@/components/admin/stat-tile";

const numberFormatter = new Intl.NumberFormat("es-CO");

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // RLS limita todo a la agencia del admin autenticado.
  const [propertiesResult, leadsCountResult, recentLeadsResult] = await Promise.all([
    supabase.from("properties").select("status, click_count"),
    // Conteo real en la base de datos: no depende de cuántos leads se traen.
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id, name, phone, country_code, created_at, properties(title, images)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const properties = propertiesResult.data ?? [];
  const totalProperties = properties.length;
  const publishedProperties = properties.filter(
    (property) => property.status === "published"
  ).length;
  const totalViews = properties.reduce((sum, property) => sum + property.click_count, 0);
  const totalLeads = leadsCountResult.count ?? 0;

  const recentGroups = groupByDay(recentLeadsResult.data ?? []);

  return (
    <div>
      <AdminListHeader title="Panel" />
      <h1 className="mb-4 text-xl text-neutral-900 sm:hidden">Panel</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
        <StatTile
          className="col-span-2 lg:col-span-1"
          icon={Building2}
          label="Propiedades publicadas"
          value={`${publishedProperties} / ${totalProperties}`}
        />
        <StatTile icon={Eye} label="Vistas totales" value={numberFormatter.format(totalViews)} />
        <StatTile icon={Users} label="Leads recibidos" value={numberFormatter.format(totalLeads)} />
      </div>

      {/* Primer ingreso de una agencia nueva: el Panel arranca vacío */}
      {totalProperties === 0 && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-neutral-900">Agrega tu primera propiedad</h2>
            <p className="text-sm text-neutral-500">
              Cuando la publiques aparecerá en tu portal y empezarás a recibir leads.
            </p>
          </div>
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm text-white hover:opacity-90"
          >
            <Plus size={16} />
            Nueva propiedad
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-gray-200 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-neutral-900">Leads recientes</h2>
          <Link
            href="/admin/leads"
            className="rounded-full bg-white px-3 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Ver todos
          </Link>
        </div>

        {recentGroups.length === 0 ? (
          <p className="text-sm text-neutral-500">Aún no has recibido leads.</p>
        ) : (
          <div className="space-y-5">
            {recentGroups.map((group) => (
              <section key={group.key}>
                <h3 className="mb-2 px-1 text-sm text-neutral-500">{group.label}</h3>
                <div className="space-y-1">
                  {group.items.map((lead) => (
                    <AdminLeadItem key={lead.id} lead={lead} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}