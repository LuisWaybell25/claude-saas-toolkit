import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware raíz. Hace dos cosas en cada request:
 *  1. Refresca la sesión de Supabase y protege rutas privadas.
 *  2. Aplica los headers de seguridad obligatorios (sección 9-11 de
 *     docs/arquitectura-estandar.md).
 */
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Evita que el navegador adivine el tipo de archivo (previene ataques
  // donde un .txt subido por un usuario se ejecuta como script).
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Impide que el sitio se cargue dentro de un <iframe> ajeno (clickjacking).
  response.headers.set("X-Frame-Options", "DENY");

  // Limita qué información de referencia se manda a sitios externos.
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Desactiva APIs del navegador que esta app no usa.
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Fuerza HTTPS por 2 años. Solo tiene efecto en producción (en localhost
  // el navegador lo ignora).
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  // Se salta archivos estáticos e imágenes: no necesitan sesión ni headers.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
