"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { brandConfig } from "@/lib/config/brand.config";

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
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-3 bg-gray-200 md:p-3">
      {/* Contenedor Izquierda: Oculto en mobile, visible en desktop */}
      <div className="relative hidden md:block overflow-hidden rounded-3xl">
        <Image
          src="/login-bg.png"
          alt="Login background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Contenedor Derecha */}
      <div className="flex items-center justify-center md:rounded-3xl bg-white p-8">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-xl font-bold text-gray-900">
            {brandConfig.name}
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Ingresa a tu panel administrativo
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-full bg-gray-200/70 p-2.5 text-sm
                           focus:outline-none focus:bg-gray-200"
                placeholder="tucorreo@agencia.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-full bg-gray-200/70 p-2.5 text-sm
                           focus:outline-none focus:bg-gray-200"
                placeholder="******"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[var(--color-primary)] py-2.5
                         text-sm font-medium text-white disabled:opacity-60"
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}