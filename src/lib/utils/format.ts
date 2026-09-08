export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: number | null): string {
  if (value === null) return "—";
  return `${new Intl.NumberFormat("es-CO").format(value)} m²`;
}