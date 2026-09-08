import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nueva propiedad</h1>
      <PropertyForm mode="create" />
    </div>
  );
}