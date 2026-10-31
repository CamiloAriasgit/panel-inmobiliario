"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { brandConfig } from "@/lib/config/brand.config";
import Link from "next/link";
import { User, ArrowUpRight, Headset } from "lucide-react";
import { getSupportWhatsappUrl } from "@/lib/config/support";

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

          <div className="absolute inset-x-3 top-3 flex justify-end">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full bg-neutral-950/80 py-2 pl-3.5 pr-3 text-xs text-white backdrop-blur-md transition hover:bg-neutral-950/65"
            >
              Ver mi portal
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <a
            href={getSupportWhatsappUrl(
              `Hola, no puedo ingresar al panel de ${brandConfig.name}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-neutral-800 p-3 text-white backdrop-blur-md transition hover:bg-neutral-950/75"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <Headset size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm">¿Problemas para ingresar?</span>
              <span className="block text-xs text-white/70">Escríbenos por WhatsApp</span>
            </span>
            <ArrowUpRight size={16} className="shrink-0 text-white/70" />
          </a>
        </div>

        <div className="flex items-center justify-center rounded-3xl bg-white p-6 sm:p-8">
          <div className="w-full max-w-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-primary)]/30 via-[var(--color-primary)]/60 to-[var(--color-primary)] text-white shadow-inner shadow-[var(--color-primary)]">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-semibold leading-tight text-gray-900">
                  {brandConfig.name}
                </h1>
                <span className="mt-0.5 inline-block rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
                  Admin
                </span>
              </div>
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