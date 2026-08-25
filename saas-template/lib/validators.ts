import { z } from "zod";

// ------------------------------------------------------------------
// UTILIDADES GENÉRICAS — reutilizables sin cambios en cualquier SaaS.
// No agregues aquí schemas de tu dominio de negocio (eso va en un
// archivo aparte, ej. lib/validators/materials.ts) — ver el skill
// `.claude/skills/nuevo-modulo-crud` para el patrón completo.
// ------------------------------------------------------------------

/** Query params de paginación estándar: ?page=1&pageSize=20 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/** Valida que un string sea un cuid/id de Prisma con la forma esperada. */
export const idSchema = z.string().min(1, "Id requerido");

export const emailSchema = z.string().trim().toLowerCase().email("Email inválido");

/**
 * Porcentaje válido para márgenes, descuentos, tasas — 0 a 100, hasta 2 decimales.
 * Ajusta el máximo (95 en el ejemplo del cotizador) según las reglas de tu dominio.
 */
export const percentSchema = z.coerce.number().min(0).max(100);

/**
 * Monto monetario positivo. Usa esto como base para cualquier campo de precio/costo
 * en los schemas de tu dominio, en vez de un z.number() suelto.
 */
export const moneyAmountSchema = z.coerce.number().nonnegative();

// ------------------------------------------------------------------
// EJEMPLO DE SCHEMA DE DOMINIO (bórralo y reemplázalo por los tuyos)
//
// export const clienteCreateSchema = z.object({
//   nombre: z.string().trim().min(2).max(160),
//   email: emailSchema.optional(),
// });
// export const clienteUpdateSchema = clienteCreateSchema.partial();
// ------------------------------------------------------------------
