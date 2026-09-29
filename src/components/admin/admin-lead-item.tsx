import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import { CopyPhoneButton } from "./copy-phone-button";
import { CountryFlag } from "./country-flag";

type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  country_code: string;
  properties: { title: string; images: string[] | null } | null;
};

export function AdminLeadItem({ lead }: { lead: LeadListItem }) {
  const propertyTitle = lead.properties?.title ?? "Propiedad eliminada";
  const coverImage = lead.properties?.images?.[0] ?? "/placeholder-property.jpg";

  const message = lead.properties
    ? `Hola ${lead.name}, te escribo por tu interés en la propiedad "${lead.properties.title}".`
    : `Hola ${lead.name}.`;
  const whatsappHref = `https://wa.me/${lead.phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-gray-100">
          <Image src={coverImage} alt="" fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-neutral-900">{lead.name}</p>
          <p className="line-clamp-1 max-w-[220px] text-sm text-neutral-500">
            {propertyTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex gap-1">
          <div className="flex items-center gap-1.5 rounded-md bg-gray-200/70 px-2">
            <CountryFlag iso={lead.country_code} />
            <p className="text-sm text-neutral-500">{lead.phone}</p>
          </div>
          <CopyPhoneButton phone={lead.phone} />
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="rounded-full p-2 text-white bg-neutral-700 hover:bg-neutral-800"
        >
          <MoveUpRight size={16} />
        </a>
      </div>
    </div>
  );
}