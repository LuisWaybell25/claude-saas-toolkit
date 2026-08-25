import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Cliente de Supabase para código que corre en el NAVEGADOR
 * (componentes marcados con "use client").
 *
 * Usa la anon key, que es pública por diseño — la seguridad real la dan
 * las políticas de Row Level Security en Postgres (ver prisma/policies/).
 * Nunca uses la service role key aquí.
 */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
