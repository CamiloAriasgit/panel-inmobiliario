export const SUPPORT_WHATSAPP_NUMBER = "573235619283";

export function getSupportWhatsappUrl(message?: string): string {
  const base = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}