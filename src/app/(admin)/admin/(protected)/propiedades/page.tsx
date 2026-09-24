import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { AdminPropertyItem } from "@/components/admin/admin-property-item";

export default async function AdminPropertiesPage() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, price, listing_type, status, click_count, images")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminListHeader
        title="Propiedades"
        createHref="/admin/propiedades/nueva"
        createLabel="Nueva propiedad"
      />

      {/* Versión mobile del encabezado: título + botón circular de crear */}
      <div className="mb-4 flex items-center justify-between sm:hidden">
        <h1 className="mb-6 text-2xl font-normal text-neutral-900">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          aria-label="Nueva propiedad"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
        >
          <Plus size={18} />
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aún no has agregado ninguna propiedad.
        </p>
      ) : (
        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          {properties.map((property) => (
            <AdminPropertyItem key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}