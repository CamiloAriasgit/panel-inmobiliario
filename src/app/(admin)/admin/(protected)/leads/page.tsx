import { createClient } from "@/lib/supabase/server";
import { CopyPhoneButton } from "@/components/admin/copy-phone-button";
import { MessageCircle } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  // RLS filtra automáticamente por la agencia del admin autenticado.
  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, created_at, properties(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Leads</h1>

      {!leads || leads.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no has recibido leads.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Propiedad</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {lead.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {lead.properties?.title ?? "Propiedad eliminada"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <CopyPhoneButton phone={lead.phone} />
                      <a
                        href={`https://wa.me/${lead.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-green-600 hover:bg-green-50"
                      >
                        <MessageCircle size={16} />
                      </a>
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