import { LayoutDashboard, Building2, Users, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];