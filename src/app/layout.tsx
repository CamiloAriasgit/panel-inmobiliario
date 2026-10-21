import type { Metadata } from "next";
import { brandConfig } from "@/lib/config/brand.config";
import { urbanist } from "@/lib/fonts";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

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
    <html lang="es" className={`${urbanist.variable} font-sans`}>
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