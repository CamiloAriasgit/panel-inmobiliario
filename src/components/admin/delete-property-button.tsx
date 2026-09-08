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
          className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
        >
          {isPending ? "..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
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
      className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={16} />
    </button>
  );
}