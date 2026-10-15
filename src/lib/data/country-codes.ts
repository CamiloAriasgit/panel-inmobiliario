export type Country = {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
};

export const COUNTRY_CODES: Country[] = [
  { iso: "CO", name: "Colombia", dialCode: "57", flag: "🇨🇴" },
  { iso: "MX", name: "México", dialCode: "52", flag: "🇲🇽" },
  { iso: "AR", name: "Argentina", dialCode: "54", flag: "🇦🇷" },
  { iso: "CL", name: "Chile", dialCode: "56", flag: "🇨🇱" },
  { iso: "PE", name: "Perú", dialCode: "51", flag: "🇵🇪" },
  { iso: "EC", name: "Ecuador", dialCode: "593", flag: "🇪🇨" },
  { iso: "VE", name: "Venezuela", dialCode: "58", flag: "🇻🇪" },
  { iso: "PA", name: "Panamá", dialCode: "507", flag: "🇵🇦" },
  { iso: "CR", name: "Costa Rica", dialCode: "506", flag: "🇨🇷" },
  { iso: "US", name: "Estados Unidos", dialCode: "1", flag: "🇺🇸" },
  { iso: "ES", name: "España", dialCode: "34", flag: "🇪🇸" },
];

export const DEFAULT_COUNTRY_ISO = "CO";

export function getCountryByIso(iso: string): Country {
  return COUNTRY_CODES.find((country) => country.iso === iso) ?? COUNTRY_CODES[0];
}

// Separa un número internacional guardado (solo dígitos, ej. "573001234567")
// en país y número local. Prueba primero los prefijos más largos, por si algún
// día un código resulta ser prefijo de otro. Devuelve null si el prefijo no
// corresponde a ningún país de la lista.
export function splitInternationalNumber(
  digits: string
): { country: Country; localNumber: string } | null {
  const byPrefixLength = [...COUNTRY_CODES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );
  const country = byPrefixLength.find((item) => digits.startsWith(item.dialCode));

  if (!country) return null;

  return { country, localNumber: digits.slice(country.dialCode.length) };
}