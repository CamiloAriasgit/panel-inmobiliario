"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Busca por ubicación, título o descripción..."
        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-24
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md
                   bg-[var(--color-primary)] px-4 py-1.5 text-sm text-white
                   disabled:opacity-60"
      >
        {isPending ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}