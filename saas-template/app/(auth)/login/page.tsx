"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, type ActionState } from "@/features/auth/actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Entrando…" : "Entrar"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded border border-line bg-surface p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-ink-soft">Entra a tu cuenta para continuar.</p>

        <form action={formAction} className="space-y-4">
          <Input label="Email" name="email" type="email" required autoComplete="email" />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Crear una
          </Link>
        </p>
      </div>
    </main>
  );
}
