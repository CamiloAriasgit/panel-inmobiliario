"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProperty, updateProperty, type PropertyFormInput } from "@/lib/actions/properties";
import { PropertyImagesField } from "./property-images-field";
import { brandConfig } from "@/lib/config/brand.config";
import { X, Plus, Save } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "lote", label: "Lote" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
];

const STATUS_OPTIONS: { value: PropertyFormInput["status"]; label: string }[] = [
  { value: "published", label: "Publicada" },
  { value: "draft", label: "Borrador" },
  { value: "archived", label: "Archivada" },
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
  status: "published",
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
    <form onSubmit={handleSubmit} className="space-y-4 pb-28 lg:pb-0">
      {/* Contenedor general que agrupa las filas */}
      <div className="space-y-4">

        {/* Fila 1: Información básica y Precio / características */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <section className="flex flex-col justify-between space-y-4 rounded-2xl bg-gray-100 p-5 lg:w-1/2">
            <div className="space-y-4">
              <h2 className="font-semibold text-neutral-900">Información básica</h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Título</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
                  className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
                    className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
                    className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
                <div className="flex flex-wrap gap-2 pt-1">
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = form.status === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("status", option.value)}
                        aria-pressed={isActive}
                        className={`rounded-full px-4 py-1.5 text-sm transition-colors focus:outline-none ${isActive
                            ? "bg-gray-200 text-neutral-700"
                            : "border border-neutral-300 text-neutral-700 hover:border-neutral-600"
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {form.status === "draft" && (
                  <p className="mt-2 text-xs text-neutral-400">No será visible al público.</p>
                )}
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-between space-y-4 rounded-2xl bg-gray-100 p-5 lg:w-1/2">
            <div className="space-y-4">
              <h2 className="font-semibold text-neutral-900">Precio y características</h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Precio (COP)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price || ""}
                  onChange={(event) => updateField("price", Number(event.target.value))}
                  placeholder="No uses puntos ni comas"
                  className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
                      className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs text-neutral-700"
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
            </div>
          </section>
        </div>

        {/* Fila 2: Ubicación e Imágenes */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <section className="flex flex-col justify-between space-y-4 rounded-2xl bg-gray-100 p-5 lg:w-1/2">
            <div className="space-y-4">
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
            </div>
          </section>

          <section className="flex flex-col justify-between rounded-2xl bg-gray-100 p-5 lg:w-1/2">
            <PropertyImagesField
              images={form.images}
              onChange={(images) => updateField("images", images)}
              agencyId={brandConfig.agencyId}
              propertyId={tempId}
            />
          </section>
        </div>

      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex justify-center p-4 pb-24 lg:justify-end lg:p-6">
        <div className="pointer-events-auto flex flex-col items-center gap-2 lg:items-end">
          {error && <p className="text-sm text-red-600 block lg:hidden">{error}</p>}
          <button
            type="submit"
            disabled={isSaving}
            className="w-auto flex items-center justify-center gap-2 rounded-full bg-neutral-800 border border-neutral-700 px-6 py-3 lg:py-2.5 text-sm text-white disabled:opacity-65 text-center shadow-sm"
          >
            {mode === "create" ? <Plus size={16} /> : <Save size={16} />}
            {isSaving ? "Guardando..." : mode === "create" ? "Crear propiedad" : "Guardar cambios"}
          </button>
        </div>
      </div>
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
        className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
        className="w-full border-b border-neutral-300 bg-transparent p-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
      />
    </div>
  );
}