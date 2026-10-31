"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brandConfig } from "@/lib/config/brand.config";

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full rounded-xl bg-gray-200/70 px-3.5 pb-1.5 pt-5 text-sm focus:bg-gray-200 focus:outline-none"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-1.5 text-[11px] text-gray-500 transition-all duration-150
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
          peer-focus:top-1.5 peer-focus:text-[11px]
          peer-autofill:top-1.5 peer-autofill:text-[11px]"
      >
        {label}
      </label>
    </div>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <main className="h-svh overflow-hidden bg-gray-200 p-3 flex items-center justify-center">
      <div className="grid w-full max-w-4xl h-full grid-rows-[1fr_auto] gap-3 overflow-hidden">

        <div className="relative min-h-0 overflow-hidden rounded-3xl">
          <Image
            src="/sky-login-bg.png"
            alt="Login background"
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        <div className="flex items-center justify-center rounded-3xl bg-white p-6 sm:p-8">
          <div className="w-full max-w-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-primary)]/30 via-[var(--color-primary)]/60 to-[var(--color-primary)] text-white shadow-inner shadow-[var(--color-primary)]">
                <User size={16} />
              </div>
              <h1 className="min-w-0 truncate font-semibold text-gray-900">
                {brandConfig.name}
              </h1>
              <span className="ml-auto rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
                Admin
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <FloatingInput
                id="email"
                label="Correo"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <FloatingInput
                id="password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-neutral-800 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              >
                {isPending ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}