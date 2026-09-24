"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProperty, updateProperty, type PropertyFormInput } from "@/lib/actions/properties";
import { PropertyImagesField } from "./property-images-field";
import { brandConfig } from "@/lib/config/brand.config";
import { X, Plus } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "lote", label: "Lote" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
];

type PropertyFormProps = {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: PropertyFormInput;
};

const EMPTY_FORM: PropertyFormInput = {
  title: "",
  slug: "",
  description: "",
  listingType: "venta",
  propertyType: "apartamento",
  status: "draft",
  price: 0,
  areaM2: null,
  bedrooms: null,
  bathrooms: null,
  parkingSpots: null,
  address: null,
  city: null,
  neighborhood: null,
  latitude: null,
  longitude: null,
  features: [],
  conditions: null,
  images: [],
};

export function PropertyForm({ mode, propertyId, initialData }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyFormInput>(initialData ?? EMPTY_FORM);
  const [featureDraft, setFeatureDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tempId] = useState(() => propertyId ?? crypto.randomUUID());

  function updateField<K extends keyof PropertyFormInput>(
    key: K,
    value: PropertyFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug:
        mode === "create"
          ? title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : prev.slug,
    }));
  }

  function addFeature() {
    const value = featureDraft.trim();
    if (value && !form.features.includes(value)) {
      updateField("features", [...form.features, value]);
    }
    setFeatureDraft("");
  }

  function removeFeature(feature: string) {
    updateField("features", form.features.filter((item) => item !== feature));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const result =
      mode === "create"
        ? await createProperty(tempId, form)
        : await updateProperty(propertyId!, form);

    setIsSaving(false);

    if (!result.success) {
      setError(result.error ?? "Ocurrió un error.");
      return;
    }

    router.push("/admin/propiedades");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <section className="space-y-4 rounded-2xl bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Información básica</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Título</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Slug (URL) <span className="text-neutral-400">— editable</span>
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Descripción</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Negocio</label>
              <select
                value={form.listingType}
                onChange={(event) =>
                  updateField("listingType", event.target.value as "venta" | "renta")
                }
                className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
              >
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Tipo de propiedad</label>
              <select
                value={form.propertyType}
                onChange={(event) => updateField("propertyType", event.target.value)}
                className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Estado</label>
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value as PropertyFormInput["status"])
              }
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            >
              <option value="draft">Borrador (no visible al público)</option>
              <option value="published">Publicada</option>
              <option value="archived">Archivada</option>
            </select>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Precio y características</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Precio (COP)</label>
            <input
              type="number"
              required
              min={0}
              value={form.price || ""}
              onChange={(event) => updateField("price", Number(event.target.value))}
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <NumberField label="Área (m²)" value={form.areaM2} onChange={(v) => updateField("areaM2", v)} />
            <NumberField label="Habitaciones" value={form.bedrooms} onChange={(v) => updateField("bedrooms", v)} />
            <NumberField label="Baños" value={form.bathrooms} onChange={(v) => updateField("bathrooms", v)} />
            <NumberField label="Parqueaderos" value={form.parkingSpots} onChange={(v) => updateField("parkingSpots", v)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Características</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {form.features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-neutral-700"
                >
                  {feature}
                  <button type="button" onClick={() => removeFeature(feature)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureDraft}
                onChange={(event) => setFeatureDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Ej. Piscina, presiona Enter"
                className="flex-1 rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
              />
              <button
                type="button"
                onClick={addFeature}
                className="rounded-lg bg-gray-200/70 px-3 hover:bg-gray-200 focus:outline-none"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Condiciones</label>
            <textarea
              rows={3}
              value={form.conditions ?? ""}
              onChange={(event) => updateField("conditions", event.target.value || null)}
              className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Ubicación</h2>

          <TextField label="Dirección" value={form.address} onChange={(v) => updateField("address", v)} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Barrio" value={form.neighborhood} onChange={(v) => updateField("neighborhood", v)} />
            <TextField label="Ciudad" value={form.city} onChange={(v) => updateField("city", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Latitud" value={form.latitude} onChange={(v) => updateField("latitude", v)} step="any" />
            <NumberField label="Longitud" value={form.longitude} onChange={(v) => updateField("longitude", v)} step="any" />
          </div>
          <p className="text-xs text-neutral-400">
            Por ahora, la latitud/longitud se ingresan manualmente (clic derecho en Google Maps → &quot;¿Qué hay aquí?&quot;).
          </p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <PropertyImagesField
            images={form.images}
            onChange={(images) => updateField("images", images)}
            agencyId={brandConfig.agencyId}
            propertyId={tempId}
          />
        </section>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full sm:w-auto rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSaving ? "Guardando..." : mode === "create" ? "Crear propiedad" : "Guardar cambios"}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        className="w-full rounded-lg bg-gray-200/70 p-2.5 text-sm focus:outline-none focus:bg-gray-200"
      />
    </div>
  );
}