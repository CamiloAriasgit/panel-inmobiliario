"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { createLead } from "@/lib/actions/leads";
import { brandConfig } from "@/lib/config/brand.config";
import { CountryCodeSelect } from "./country-code-select";
import { DEFAULT_COUNTRY_ISO } from "@/lib/data/country-codes";
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
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLead({
        propertyId: property.id,
        agencyId: brandConfig.agencyId,
        name,
        phone,
        countryIso,
        acceptedPrivacyPolicy: acceptedPolicy,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.open(result.whatsappUrl, "_blank");
      onClose();
    });
  }

  if (!mounted) return null;

  return createPortal(
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
                         focus:outline-none focus:bg-gray-100"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Número de teléfono
            </label>
            <div className="flex">
              <CountryCodeSelect value={countryIso} onChange={setCountryIso} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full bg-gray-200/70 min-w-0 rounded-r-md border-l border-white p-2.5 text-sm
                           focus:outline-none focus:bg-gray-200"
                placeholder="3001234567"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              required
              checked={acceptedPolicy}
              onChange={(event) => setAcceptedPolicy(event.target.checked)}
              className="mt-0.5"
            />
            <span>
              He leído y acepto la{" "}
              <Link
                href="/politica-de-privacidad"
                target="_blank"
                className="underline"
              >
                Política de Tratamiento de Datos
              </Link>{" "}
              de {brandConfig.name}.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full
                       bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white
                       hover:bg-[var(--color-primary)]/80 disabled:opacity-60"
          >
            {isPending ? "Enviando..." : "Ir a WhatsApp"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}