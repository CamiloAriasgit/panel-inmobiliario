import type { Metadata } from "next";
import { brandConfig } from "@/lib/config/brand.config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: brandConfig.siteTitle,
    template: `%s | ${brandConfig.name}`,
  },
  description: brandConfig.siteSubtitle,
  icons: {
    icon: brandConfig.faviconUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={
          {
            "--color-primary": brandConfig.primaryColor,
            "--color-secondary": brandConfig.secondaryColor,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}