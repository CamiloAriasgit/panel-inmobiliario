"use client";

import { COUNTRY_CODES } from "@/lib/data/country-codes";

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Código de país"
      className="shrink-0 rounded-md border border-gray-300 bg-white p-2.5 text-sm
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
    >
      {COUNTRY_CODES.map((country) => (
        <option key={country.iso} value={country.iso}>
          {country.flag} +{country.dialCode}
        </option>
      ))}
    </select>
  );
}