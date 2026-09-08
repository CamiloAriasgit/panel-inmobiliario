import { createClient } from "@/lib/supabase/server";
import { WhatsappConfigForm } from "@/components/admin/whatsapp-config-form";

export default async function AdminConfigPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("agency_id")
    .eq("id", user!.id)
    .single();

  const { data: agency } = await supabase
    .from("agencies")
    .select("name, whatsapp_number")
    .eq("id", profile!.agency_id)
    .single();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Configuración</h1>

      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 font-semibold text-gray-900">
          Número de WhatsApp
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          A este número llegarán los interesados que contacten desde{" "}
          {agency?.name}.
        </p>
        <WhatsappConfigForm currentNumber={agency?.whatsapp_number ?? ""} />
      </div>
    </div>
  );
}