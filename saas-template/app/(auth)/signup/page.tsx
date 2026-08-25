"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup, type ActionState } from "@/features/auth/actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creando cuenta…" : "Crear cuenta"}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm rounded border border-line bg-surface p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink">Crear cuenta</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Esto crea tu negocio y tu usuario administrador.
        </p>

        <form action={formAction} className="space-y-4">
          <Input
            label="Nombre del negocio"
            name="businessName"
            required
            placeholder="Ej. Mi Empresa SA de CV"
          />
          <Input label="Tu nombre" name="userName" required autoComplete="name" />
          <Input label="Email" name="email" type="email" required autoComplete="email" />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />

          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          {state.success && <p className="text-sm text-accent-dark">{state.success}</p>}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
