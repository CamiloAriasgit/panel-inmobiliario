"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COUNTRY_CODES, getCountryByIso } from "@/lib/data/country-codes";
import { CountryFlag } from "@/components/ui/country-flag";

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = getCountryByIso(value);

  // Cierra al tocar o hacer clic fuera del selector.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Al abrir, el foco va a la opción seleccionada para poder usar el teclado.
  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
      ?.focus();
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function select(iso: string) {
    onChange(iso);
    close();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const options = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []
      );
      const index = options.indexOf(document.activeElement as HTMLButtonElement);
      const next =
        event.key === "ArrowDown"
          ? options[index + 1] ?? options[0]
          : options[index - 1] ?? options[options.length - 1];
      next?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="relative flex shrink-0"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Código de país: ${selected.name}`}
        className="flex items-center gap-2 rounded-l-full bg-gray-200/70 py-2.5 pl-3.5 pr-2.5
                   text-sm text-gray-700 hover:bg-gray-200
                   focus:outline-none focus-visible:bg-gray-200"
      >
        <CountryFlag iso={selected.iso} />
        <span>+{selected.dialCode}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Países"
          className="absolute left-0 top-full z-10 mt-1 max-h-60 w-64 overflow-y-auto
                     rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          {COUNTRY_CODES.map((country) => {
            const isSelected = country.iso === value;

            return (
              <button
                key={country.iso}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => select(country.iso)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left
                            text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100
                            focus:outline-none ${isSelected ? "bg-gray-100" : ""}`}
              >
                <CountryFlag iso={country.iso} />
                <span className="flex-1 truncate">{country.name}</span>
                <span className="text-gray-400">+{country.dialCode}</span>
                {isSelected && <Check size={14} className="shrink-0 text-gray-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}