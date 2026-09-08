import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Segunda capa de protección además del middleware: si por algún
  // motivo se renderiza este layout sin sesión (ej. el middleware no
  // corrió, o se invalidó la sesión entre la petición y el render),
  // no se confía únicamente en el middleware para proteger los datos.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar adminName={profile?.full_name ?? user.email ?? "Admin"} />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}