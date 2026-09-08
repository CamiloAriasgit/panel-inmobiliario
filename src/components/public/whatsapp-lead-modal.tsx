"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createLead } from "@/lib/actions/leads";
import { brandConfig } from "@/lib/config/brand.config";
import type { Tables } from "@/types/database.types";

export function WhatsappLeadModal({
  property,
  onClose,
}: {
  property: Tables<"properties">;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLead({
        propertyId: property.id,
        agencyId: brandConfig.agencyId,
        name,
        phone,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Abre WhatsApp en una pestaña nueva y cierra el modal.
      window.open(result.whatsappUrl, "_blank");
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Contactar por WhatsApp
          </h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500 line-clamp-1">
          Sobre: {property.title}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Número de teléfono
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Ej. 3001234567"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg
                       bg-green-600 py-2.5 text-sm font-medium text-white
                       hover:bg-green-700 disabled:opacity-60"
          >
            {isPending ? "Enviando..." : "Ir a WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}