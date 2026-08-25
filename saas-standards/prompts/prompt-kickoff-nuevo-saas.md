# Plantilla de prompt: arrancar un SaaS nuevo

> Cómo usar esto: copia el bloque de abajo, llena los espacios entre [corchetes], y pégalo como
> primer mensaje en un Proyecto de Claude nuevo (claude.ai) o en una sesión de Claude Code dentro
> del repo recién creado desde la plantilla. Adjunta `docs/arquitectura-estandar.md` como
> conocimiento del proyecto si estás en claude.ai — en Claude Code ya lo carga `CLAUDE.md` vía
> `@docs/arquitectura-estandar.md`.

---

Vamos a construir un SaaS nuevo siguiendo nuestra arquitectura estándar para múltiples productos (documento adjunto/referenciado: `arquitectura-estandar.md`).

**Nombre del producto**: [NOMBRE_DEL_SAAS]

**En una línea**: [QUÉ HACE Y PARA QUIÉN — ej. "SaaS de agendamiento y CRM ligero para talleres mecánicos independientes"]

**Vertical / industria objetivo**: [EJ. "Talleres mecánicos independientes en México, 1-10 empleados"]

**Entidades principales del dominio** (para el esquema de base de datos):
- [ENTIDAD_1 — ej. "Cliente: nombre, teléfono, vehículos asociados"]
- [ENTIDAD_2 — ej. "Orden de servicio: vehículo, diagnóstico, refacciones, mano de obra, estado"]
- [ENTIDAD_3 — ...]
- [Agregar las que hagan falta]

**Módulos del MVP, en el orden en que se van a construir**:
1. [MÓDULO_1 — normalmente: esquema de base de datos]
2. [MÓDULO_2 — normalmente: configuración/catálogo base]
3. [MÓDULO_3 — la funcionalidad core del producto]
4. [MÓDULO_4 — si aplica]
5. [MÓDULO_5 — si aplica]

**Reglas de negocio específicas de este dominio que no están en la arquitectura estándar** (si las hay):
[EJ. "El margen se calcula distinto para refacciones que para mano de obra" — cualquier cosa propia de este vertical que el motor de cálculo/reglas necesite saber]

**Identidad visual**: usa el design system compartido tal cual (ver `docs/design-system.md` del template). Este producto no lleva paleta ni tipografía propias — solo cambia el nombre en la barra lateral y los elementos de navegación.

---

**Instrucciones para Claude**:

1. Sigue exactamente el stack y las convenciones de `arquitectura-estandar.md`: Next.js (App Router) + Prisma + PostgreSQL vía Supabase + Supabase Auth + Tailwind + Zod, multi-tenant vía `tenantId` + RLS, testing obligatorio desde el primer commit (Vitest + React Testing Library + Playwright), ESLint estricto + Husky pre-commit + CI en GitHub Actions.
   - Organiza el código por dominio en `features/<dominio>/` (schemas, service, tests, components), con route handlers delgados en `app/api/`.
   - El módulo `features/materiales/` del template es la referencia viva del patrón CRUD: revísalo antes de escribir uno nuevo.
2. Construye por fases, una a la vez, en el orden listado arriba — no avances a la siguiente fase sin confirmación.
3. Empieza por la Fase 1 (esquema de base de datos): diseña el `schema.prisma` completo para las entidades descritas arriba, aplicando los mismos patrones ya probados (snapshots de costo donde aplique, soft-delete en catálogos referenciados, folios/secuencias por tenant si el dominio los necesita). `Tenant` y `User` ya vienen en el template — no los rediseñes, constrúyelas encima. Por cada tabla nueva con `tenantId`, agrega también su política en `prisma/policies/rls.sql`.
4. Cualquier decisión de arquitectura que no esté cubierta por el documento estándar, señálala explícitamente en vez de improvisar en silencio.
