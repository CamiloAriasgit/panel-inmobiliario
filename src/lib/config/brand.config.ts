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

  legalName: string;
  taxId: string;
  contactEmail: string;
  address: string;

};

export const brandConfig: BrandConfig = {
  agencyId: "e3585152-a432-4e5d-8371-590f8e93b947",
  name: "Inmobiliaria Ejemplo",
  slug: "inmobiliaria-ejemplo",

  primaryColor: "#0f172a",
  secondaryColor: "#f8fafc",

  logoUrl: "/brand/logo.png",
  faviconUrl: "/brand/favicon.ico",

  siteTitle: "Encuentra tu próximo hogar",
  siteSubtitle: "Propiedades en venta y renta seleccionadas para ti",

  whatsappNumber: "573001234567",

  legalName: "Inmobiliaria Ejemplo S.A.S.",
  taxId: "900.000.000-0",
  contactEmail: "contacto@inmobiliariaejemplo.com",
  address: "Calle 00 # 00-00, Medellín, Colombia",
};