import Link from "next/link";
import { Building2, Users, MousePointerClick } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // No se filtra por agency_id manualmente aquí: RLS ya garantiza
  // que este usuario admin solo puede ver las filas de su propia
  // agencia (política "admin gestiona propiedades de su agencia").
  const [{ data: properties }, { data: leads }] = await Promise.all([
    supabase.from("properties").select("id, click_count, status"),
    supabase
      .from("leads")
      .select("id, name, phone, created_at, properties(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalProperties = properties?.length ?? 0;
  const publishedProperties =
    properties?.filter((property) => property.status === "published").length ?? 0;
  const totalClicks =
    properties?.reduce((sum, property) => sum + property.click_count, 0) ?? 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Panel</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Propiedades publicadas"
          value={`${publishedProperties} / ${totalProperties}`}
        />
        <StatCard
          icon={MousePointerClick}
          label="Clics totales"
          value={totalClicks.toString()}
        />
        <StatCard
          icon={Users}
          label="Leads recibidos"
          value={(leads?.length ?? 0).toString()}
          hint="Últimos 5 mostrados abajo"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Leads recientes</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {!leads || leads.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no has recibido leads.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-gray-500">
                    {lead.properties?.title ?? "Propiedad eliminada"}
                  </p>
                </div>
                <span className="text-gray-500">{lead.phone}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2 text-gray-500">
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}