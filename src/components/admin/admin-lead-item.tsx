import { MessageCircle } from "lucide-react";
import { CopyPhoneButton } from "./copy-phone-button";

type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  properties: { title: string } | null;
};

export function AdminLeadItem({ lead }: { lead: LeadListItem }) {
  const formattedDate = new Date(lead.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium text-neutral-900">{lead.name}</p>
        <p className="truncate text-sm text-neutral-500">
          {lead.properties?.title ?? "Propiedad eliminada"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-sm text-neutral-500">
          <p>{lead.phone}</p>
          <p className="text-xs">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-1">
          <CopyPhoneButton phone={lead.phone} />
          <a
            href={`https://wa.me/${lead.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="rounded-full p-2 text-green-600 hover:bg-gray-100"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}