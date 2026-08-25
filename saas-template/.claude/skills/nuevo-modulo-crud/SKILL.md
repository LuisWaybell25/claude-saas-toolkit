---
name: nuevo-modulo-crud
description: Use when adding a new catalog-style CRUD module (a new business entity with list/create/edit/delete) to a SaaS built on the standard stack — Next.js App Router + Prisma + Zod + Supabase. Triggers on requests like "agrega un catálogo de X", "crea el CRUD de X", "necesito un módulo para gestionar X".
---

# Nuevo módulo CRUD de catálogo

Encapsula el patrón implementado en `features/materiales/` (el módulo de ejemplo del template).
Úsalo en vez de reinventar la estructura cada vez.

**Antes de empezar: lee `features/materiales/` completo.** Es la referencia viva del patrón —
schemas, servicio, tests de aislamiento, route handlers y componente. Copiar de ahí es más rápido
y más seguro que escribir desde cero.

## Cuándo usar esto

Cuando la entidad nueva es un catálogo del tenant: tiene nombre, campos propios, estado
activo/inactivo, y posiblemente es referenciada por entidades transaccionales. No lo uses para
entidades con lógica de negocio compleja propia — esas se diseñan caso por caso.

## Pasos

1. **Modelo en `prisma/schema.prisma`**: `id`, `tenantId` (con `@@index([tenantId])`), campos
   propios, `active Boolean @default(true)`. Después: `npx prisma migrate dev --name add_<entidad>`.

2. **Política RLS en `prisma/policies/rls.sql`**: copia la plantilla del final del archivo y
   reemplaza `<tabla>`. Ninguna tabla con `tenantId` debe quedarse sin política.

3. **`features/<entidad>/schemas.ts`**: `<entidad>CreateSchema` con Zod y
   `<entidad>UpdateSchema = <entidad>CreateSchema.partial()`. Reutiliza las utilidades de
   `lib/validators.ts` (`moneyAmountSchema`, `percentSchema`, `emailSchema`) en vez de redefinirlas.

4. **`features/<entidad>/service.ts`**: todas las funciones reciben `tenantId` como parámetro
   explícito y lo incluyen en el `where`. Incluye una función `assert<Entidad>Ownership(id, tenantId)`
   que use `findFirst({ where: { id, tenantId } })` y lance `NotFoundError` — llámala antes de
   cualquier update/delete. Nunca hagas `update({ where: { id } })` sin esa verificación previa.

5. **`features/<entidad>/service.test.ts`**: copia el molde de
   `features/materiales/service.test.ts`. **Obligatorio incluir los tests de aislamiento**: que
   listar filtre por tenant, que crear asigne el tenant de la sesión, y que editar/borrar un
   registro de otro tenant sea rechazado.

6. **`app/api/<entidad>/route.ts` y `app/api/<entidad>/[id]/route.ts`**: handlers delgados —
   `getTenantContext()`, validar con Zod, llamar al servicio, `handleApiError` en el catch.
   Cero lógica de negocio aquí.

7. **UI (si aplica)**: `features/<entidad>/components/` para la tabla/formulario, y una página en
   `app/(dashboard)/<entidad>/page.tsx` que los use. Reutiliza los primitivos de `components/ui/`.

8. **Antes de dar por terminado**: corre `npm run verify` e invoca el subagente
   `revisor-aislamiento-tenant` sobre los archivos nuevos de `app/api/` y `features/`.

## Qué NO hacer

- No leas el `tenantId` del body, query string ni headers — solo de `getTenantContext()`.
- No pongas queries de Prisma en `app/api/**` — van en `features/<entidad>/service.ts`.
- No hagas borrado físico por defecto si la entidad puede estar referenciada en historial.
- No dupliques helpers de `lib/` (`handleApiError`, `getTenantContext`) — impórtalos.
- No extraigas nada de esto a un paquete npm compartido todavía: eso solo aplica después de
  repetirlo sin cambios en 2+ SaaS reales (sección 11 de la arquitectura estándar).
