"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Plus } from "lucide-react";
import { createProperty, updateProperty, type PropertyFormInput } from "@/lib/actions/properties";
import { uploadPropertyImage } from "@/lib/utils/upload-image";
import { brandConfig } from "@/lib/config/brand.config";

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
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Para propiedades nuevas aún no existe un ID real en la base de
    // datos, pero las imágenes necesitan subirse a alguna carpeta ya.
    // Se genera un ID temporal estable durante toda la sesión del
    // formulario, que luego se reutiliza como el ID real al crear.
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
            // El slug solo se autogenera si el usuario no lo ha editado
            // manualmente ya (mode "create" y aún coincide con el anterior).
            slug:
                mode === "create"
                    ? title
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") // quita tildes
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
        updateField(
            "features",
            form.features.filter((item) => item !== feature)
        );
    }

    async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            const uploadedUrls = await Promise.all(
                Array.from(files).map((file) =>
                    uploadPropertyImage(file, brandConfig.agencyId, tempId)
                )
            );
            updateField("images", [...form.images, ...uploadedUrls]);
        } catch {
            setError("No se pudieron subir una o más imágenes.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function removeImage(url: string) {
        updateField(
            "images",
            form.images.filter((image) => image !== url)
        );
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
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="font-semibold text-gray-900">Información básica</h2>

                <div>
                    <label className="mb-1 block text-sm font-medium">Título</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(event) => handleTitleChange(event.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Slug (URL) <span className="text-gray-400">— editable</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={form.slug}
                        onChange={(event) => updateField("slug", event.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Descripción</label>
                    <textarea
                        required
                        rows={4}
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Negocio</label>
                        <select
                            value={form.listingType}
                            onChange={(event) =>
                                updateField("listingType", event.target.value as "venta" | "renta")
                            }
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                        >
                            <option value="venta">Venta</option>
                            <option value="renta">Renta</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Tipo de propiedad</label>
                        <select
                            value={form.propertyType}
                            onChange={(event) => updateField("propertyType", event.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
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
                    <label className="mb-1 block text-sm font-medium">Estado</label>
                    <select
                        value={form.status}
                        onChange={(event) =>
                            updateField("status", event.target.value as PropertyFormInput["status"])
                        }
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    >
                        <option value="draft">Borrador (no visible al público)</option>
                        <option value="published">Publicada</option>
                        <option value="archived">Archivada</option>
                    </select>
                </div>
            </section>

            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="font-semibold text-gray-900">Precio y características</h2>

                <div>
                    <label className="mb-1 block text-sm font-medium">Precio (COP)</label>
                    <input
                        type="number"
                        required
                        min={0}
                        value={form.price || ""}
                        onChange={(event) => updateField("price", Number(event.target.value))}
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <NumberField label="Área (m²)" value={form.areaM2} onChange={(v) => updateField("areaM2", v)} />
                    <NumberField label="Habitaciones" value={form.bedrooms} onChange={(v) => updateField("bedrooms", v)} />
                    <NumberField label="Baños" value={form.bathrooms} onChange={(v) => updateField("bathrooms", v)} />
                    <NumberField label="Parqueaderos" value={form.parkingSpots} onChange={(v) => updateField("parkingSpots", v)} />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Características</label>
                    <div className="mb-2 flex flex-wrap gap-2">
                        {form.features.map((feature) => (
                            <span
                                key={feature}
                                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
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
                            className="flex-1 rounded-md border border-gray-300 p-2.5 text-sm"
                        />
                        <button
                            type="button"
                            onClick={addFeature}
                            className="rounded-md border border-gray-300 px-3 hover:bg-gray-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Condiciones</label>
                    <textarea
                        rows={3}
                        value={form.conditions ?? ""}
                        onChange={(event) => updateField("conditions", event.target.value || null)}
                        className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
                    />
                </div>
            </section>

            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="font-semibold text-gray-900">Ubicación</h2>

                <TextField label="Dirección" value={form.address} onChange={(v) => updateField("address", v)} />
                <div className="grid grid-cols-2 gap-4">
                    <TextField label="Barrio" value={form.neighborhood} onChange={(v) => updateField("neighborhood", v)} />
                    <TextField label="Ciudad" value={form.city} onChange={(v) => updateField("city", v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberField label="Latitud" value={form.latitude} onChange={(v) => updateField("latitude", v)} step="any" />
                    <NumberField label="Longitud" value={form.longitude} onChange={(v) => updateField("longitude", v)} step="any" />
                </div>
                <p className="text-xs text-gray-400">
                    Por ahora, la latitud/longitud se ingresan manualmente (puedes obtenerlas haciendo clic derecho en Google Maps → "¿Qué hay aquí?"). Más adelante se puede reemplazar por un selector visual sobre el mapa.
                </p>
            </section>

            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="font-semibold text-gray-900">Imágenes</h2>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {form.images.map((image) => (
                        <div key={image} className="group relative aspect-square overflow-hidden rounded-md">
                            <Image src={image} alt="" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(image)}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 disabled:opacity-60"
                    >
                        <Upload size={20} />
                        <span className="text-xs">{isUploading ? "Subiendo..." : "Agregar"}</span>
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                />
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={isSaving || isUploading}
                className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
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
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
                type="text"
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value || null)}
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
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
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
                type="number"
                step={step}
                value={value ?? ""}
                onChange={(event) =>
                    onChange(event.target.value === "" ? null : Number(event.target.value))
                }
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
        </div>
    );
}