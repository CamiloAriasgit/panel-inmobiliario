export type BrandConfig = {
  agencyId: string;
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  siteTitle: string;
  siteSubtitle: string;
  whatsappNumber: string;
};

export const brandConfig: BrandConfig = {
  agencyId: "e3585152-a432-4e5d-8371-590f8e93b947",
  name: "Inmobiliaria Ejemplo",
  slug: "inmobiliaria-ejemplo",

  primaryColor: "#0f172a",
  secondaryColor: "#f8fafc",

  logoUrl: "/brand/logo.svg",
  faviconUrl: "/brand/favicon.ico",

  siteTitle: "Encuentra tu próximo hogar",
  siteSubtitle: "Propiedades en venta y renta seleccionadas para ti",

  whatsappNumber: "573001234567",
};