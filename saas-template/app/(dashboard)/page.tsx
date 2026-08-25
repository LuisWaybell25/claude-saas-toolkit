import Link from "next/link";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { getTenantContext } from "@/lib/tenant-context";

export default async function DashboardPage() {
  const { email, role } = await getTenantContext();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Inicio</h1>
          <p className="text-sm text-ink-soft">
            Sesión iniciada como {email} ({role.toLowerCase()}).
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="secondary">
            Cerrar sesión
          </Button>
        </form>
      </div>

      <div className="rounded border border-line bg-surface p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">Siguiente paso</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Este template ya trae autenticación, aislamiento por tenant y un módulo CRUD de
          ejemplo funcionando. Revisa el catálogo de ejemplo y luego reemplázalo por las
          entidades de tu dominio.
        </p>
        <Link href="/materiales" className="text-sm text-accent hover:underline">
          Ver el módulo de ejemplo →
        </Link>
      </div>
    </main>
  );
}
