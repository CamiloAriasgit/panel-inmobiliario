import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, MousePointerClick } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  published: "Publicada",
  archived: "Archivada",
};

export default async function AdminPropertiesPage() {
  const supabase = await createClient();

  // RLS filtra automáticamente por la agencia del admin autenticado.
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, slug, price, listing_type, status, click_count, images")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)]
                     px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Nueva propiedad
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aún no has agregado ninguna propiedad.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Propiedad</th>
                <th className="px-4 py-3">Negocio</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Clics</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={property.images?.[0] ?? "/placeholder-property.jpg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="line-clamp-1 font-medium text-gray-900">
                      {property.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">
                    {property.listing_type}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatPrice(property.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        property.status === "published"
                          ? "bg-green-100 text-green-700"
                          : property.status === "draft"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {STATUS_LABELS[property.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MousePointerClick size={14} />
                      {property.click_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/propiedades/${property.id}`}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeletePropertyButton propertyId={property.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}