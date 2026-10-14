"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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

  return (
    <>
      {/* Botón original intacto */}
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="rounded-md p-2 text-gray-500 bg-gray-300/70 hover:bg-red-200 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>

      {/* Ventana central (Modal) */}
      {isConfirming && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
            {/* Ícono superior centrado */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1">
              <h3 id="modal-title" className="text-lg medium text-neutral-900">
                ¿Eliminar propiedad?
              </h3>
              <p className="text-sm text-neutral-600">
                Esta acción no se puede deshacer. Se borrarán también los leads que te hayan contactado a través de esta propiedad.
              </p>
            </div>

            {/* Botones 50-50 en la misma fila */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                disabled={isPending}
                className="w-full rounded-md bg-gray-200 px-4 py-2.5 text-xs font-medium text-neutral-800 hover:bg-gray-200 disabled:opacity-60 transition-colors"
              >
                No, Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="w-full rounded-md bg-red-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isPending ? "Eliminando..." : "Sí, confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}