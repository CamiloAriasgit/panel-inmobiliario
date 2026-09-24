"use client";

import { COUNTRY_CODES } from "@/lib/data/country-codes";
import { ChevronDown } from "lucide-react";

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  return (
    <div className="relative inline-block shrink-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Código de país"
        className="w-full appearance-none rounded-l-full borde border-r-0 border-gray-300 bg-gray-200/70 py-2.5 pl-2.5 pr-8 text-sm
                   focus:outline-none focus:bg-gray-200"
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.iso} value={country.iso}>
            {country.flag} +{country.dialCode}
          </option>
        ))}
      </select>
      
      {/* Ícono personalizado alineado a la derecha */}
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}