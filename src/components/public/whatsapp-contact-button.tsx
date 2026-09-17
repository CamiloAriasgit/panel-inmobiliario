"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { WhatsappLeadModal } from "./whatsapp-lead-modal";
import type { Tables } from "@/types/database.types";

export function WhatsappContactButton({
  property,
}: {
  property: Tables<"properties">;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full
                   bg-[var(--color-primary)] py-3 text-sm font-medium text-white
                   hover:bg-[var(--color-primary)]/80"
      >
        <MessageCircle size={18} />
        Contactar por WhatsApp
      </button>

      {isModalOpen && (
        <WhatsappLeadModal
          property={property}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}