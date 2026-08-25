import { z } from "zod";

/**
 * Variables de entorno validadas al arrancar.
 *
 * Sin esto, una variable faltante se manifiesta como un error confuso en
 * runtime ("undefined is not a valid URL") a mitad de una petición. Con
 * esto, el proyecto falla de inmediato y dice exactamente qué falta.
 *
 * Nota sobre Next.js: las variables NEXT_PUBLIC_* se sustituyen en tiempo
 * de compilación, así que hay que referenciarlas por su nombre completo
 * (no con process.env[nombreVariable]) para que el bundler las reemplace.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY es requerida"),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Faltan variables de entorno requeridas:\n${parsed.error.issues
      .map((i) => `  - ${i.message}`)
      .join("\n")}\n\nCopia .env.example a .env.local y llénalo con los datos de tu proyecto de Supabase.`
  );
}

export const env = parsed.data;
