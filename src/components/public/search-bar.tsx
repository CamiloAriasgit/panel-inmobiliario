"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full lg:max-w-2xl">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Busca por ubicación, título o descripción..."
        className="w-full rounded-full border border-gray-300 py-3 pl-4 pr-14
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
      />
      <button
        type="submit"
        disabled={isPending}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full
                   bg-neutral-800 p-2 text-white
                   disabled:opacity-60"
        aria-label="Buscar"
      >
        {isPending ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Search size={20} />
        )}
      </button>
    </form>
  );
}