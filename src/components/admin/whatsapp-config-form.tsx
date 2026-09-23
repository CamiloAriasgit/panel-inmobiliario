"use client";

import { useState, useTransition } from "react";
import { updateAgencyWhatsapp } from "@/lib/actions/agency";

type FormMessage = { type: "success" | "error"; text: string };

export function WhatsappConfigForm({
  currentNumber,
}: {
  currentNumber: string;
}) {
  const [value, setValue] = useState(currentNumber);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isPending, startTransition] = useTransition();


    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const result = await updateAgencyWhatsapp(value);

            if (!result.success) {
                setMessage({ type: "error", text: result.error ?? "Error." });
                return;
            }

            setMessage({ type: "success", text: "Número actualizado." });
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="tel"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Ej. 573001234567"
                className="w-full bg-white rounded-md borde border-gray-300 p-2.5 text-sm"
            />

            {message && (
                <p
                    className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message.text}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[var(--color-primary)] w-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
                {isPending ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}