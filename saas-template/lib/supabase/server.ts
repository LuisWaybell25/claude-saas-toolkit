import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Cliente de Supabase para código que corre en el SERVIDOR
 * (Server Components, route handlers, Server Actions).
 *
 * Lee la sesión desde las cookies de la request. Es lo que usa
 * `lib/tenant-context.ts` para saber quién está haciendo cada petición.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Llamado desde un Server Component: el middleware ya refresca
          // la sesión, así que este error se puede ignorar sin riesgo.
        }
      },
    },
  });
}
