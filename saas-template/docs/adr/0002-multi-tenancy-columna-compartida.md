# ADR-0002: Multi-tenancy por columna `tenantId` en base de datos compartida

- **Fecha**: 2026-08-23
- **Estado**: Aceptado

## Contexto

Todo SaaS de la cartera necesita aislar los datos de cada cliente (tenant). La elección afecta
costo, complejidad de mantenimiento y velocidad para agregar clientes nuevos.

## Alternativas consideradas

- **Base de datos por cliente** — máximo aislamiento, pero multiplica el costo y el trabajo de
  migraciones por cada cliente nuevo.
- **Esquema separado por cliente** — punto intermedio; migraciones aún se multiplican.
- **Base de datos compartida con columna `tenantId`** — un solo esquema, un solo lugar para
  migrar, costo casi plano al agregar clientes.

## Decisión

**Base de datos compartida con `tenantId`**, reforzada con dos capas de protección:

1. **Aplicación**: `getTenantContext()` deriva el tenant de la sesión de Supabase (nunca de input
   del cliente), y toda query de servicio filtra por él explícitamente.
2. **Base de datos**: políticas de Row Level Security en Postgres (`prisma/policies/rls.sql`) que
   bloquean el acceso cruzado aunque una query nueva olvide el filtro.

## Consecuencias

- El costo de infraestructura casi no sube con el número de clientes — de ahí los márgenes brutos
  de 85-97% proyectados.
- El riesgo se concentra en un solo tipo de error: olvidar el filtro por tenant. Por eso el test de
  aislamiento es obligatorio en cada módulo y existe el subagente `revisor-aislamiento-tenant`.
- Un cliente que exija aislamiento físico requiere una excepción manual, no es el default.

## Cuándo reconsiderar

Cuando un cliente empresarial exija aislamiento físico por contrato o regulación. En ese caso se
mueve **solo a ese tenant** a un esquema o base dedicada (Prisma puede apuntar a otro
`DATABASE_URL` por tenant) y se cobra al precio de ese cliente — no se migra toda la arquitectura.
