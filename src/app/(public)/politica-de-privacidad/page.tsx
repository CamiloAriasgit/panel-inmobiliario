import { brandConfig } from "@/lib/config/brand.config";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Política de Tratamiento de Datos Personales
      </h1>
      <p className="text-gray-600">
        Contenido pendiente — se completará con el texto legal definitivo de{" "}
        {brandConfig.name}.
      </p>
    </main>
  );
}