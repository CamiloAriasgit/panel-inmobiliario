"use client";

import { useState, useTransition } from "react";
import { updateAgencyWhatsapp } from "@/lib/actions/agency";
import { CountryCodeSelect } from "@/components/ui/country-code-select";
import {
  DEFAULT_COUNTRY_ISO,
  splitInternationalNumber,
} from "@/lib/data/country-codes";

type FormMessage = { type: "success" | "error"; text: string };

export function WhatsappConfigForm({
  currentNumber,
}: {
  currentNumber: string;
}) {
  const currentDigits = currentNumber.replace(/\D/g, "");

  // El número guardado es el completo (prefijo + número): se separa para
  // mostrar la bandera y el número local por separado.
  const parsed = splitInternationalNumber(currentDigits);
  const hasUnknownCountry = currentDigits.length > 0 && !parsed;

  const [countryIso, setCountryIso] = useState(
    parsed?.country.iso ?? DEFAULT_COUNTRY_ISO
  );
  const [localNumber, setLocalNumber] = useState(parsed?.localNumber ?? "");
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateAgencyWhatsapp(countryIso, localNumber);

      if (!result.success) {
        setMessage({ type: "error", text: result.error ?? "Error." });
        return;
      }

      setMessage({ type: "success", text: "Número actualizado." });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <div className="flex">
          <CountryCodeSelect
            value={countryIso}
            onChange={setCountryIso}
            triggerClassName="rounded-l-lg bg-gray-300/70 hover:bg-gray-300 focus-visible:bg-gray-300"
          />
          <input
            type="tel"
            required
            value={localNumber}
            onChange={(event) => setLocalNumber(event.target.value)}
            placeholder="3001234567"
            className="w-full min-w-0 rounded-r-lg border-l border-gray-200 bg-gray-300/70 p-2.5 text-sm focus:bg-gray-300 focus:outline-none"
          />
        </div>

        <p className="mt-1.5 text-xs text-neutral-500">
          {hasUnknownCountry
            ? `Tu número actual (+${currentDigits}) usa un prefijo que aún no está en la lista de países.`
            : "Escríbelo sin el código del país: se agrega según la bandera."}
        </p>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-800 disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}