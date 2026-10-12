"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProperty } from "@/lib/actions/properties";

export function DeletePropertyButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProperty(propertyId);
      setIsConfirming(false);
    });
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md bg-red-200 text-red-600 px-2 py-1.5 text-xs font-medium hover:bg-red-200/70 disabled:opacity-60"
        >
          {isPending ? "..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="rounded-md bg-gray-100 px-2 py-1.5 text-xs font-medium text-neutral-500 hover:bg-gray-100/70"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="rounded-md p-2 text-gray-500 bg-gray-300/70 hover:bg-red-200 hover:text-red-600"
    >
      <Trash2 size={16} />
    </button>
  );
}