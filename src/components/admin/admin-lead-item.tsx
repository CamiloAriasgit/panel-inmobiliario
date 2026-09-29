import { MoveUpRight } from "lucide-react";
import { CopyPhoneButton } from "./copy-phone-button";

type LeadListItem = {
    id: string;
    name: string;
    phone: string;
    properties: { title: string } | null;
};

export function AdminLeadItem({ lead }: { lead: LeadListItem }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="font-medium text-neutral-900">{lead.name}</p>
                <p className="truncate text-sm text-neutral-500">
                    {lead.properties?.title ?? "Propiedad eliminada"}
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex gap-1">
                    <div className="flex items-center px-2 rounded-md bg-gray-200/70">
                        <p className="text-sm text-neutral-500">{lead.phone}</p>
                    </div>
                    <CopyPhoneButton phone={lead.phone} />
                </div>


                <div className="flex items-center gap-1">
                    <a
                        href={`https://wa.me/${lead.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contactar por WhatsApp"
                        className="rounded-full p-2 text-white bg-neutral-700 hover:bg-neutral-800"
                    >
                        <MoveUpRight size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}