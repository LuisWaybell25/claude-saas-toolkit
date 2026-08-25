# saas-template

Boilerplate real y verificado para arrancar un SaaS B2B multi-tenant: Next.js 14 (App Router) +
TypeScript + Supabase (Postgres + Auth) + Prisma + Tailwind + Zod, con autenticación funcionando,
aislamiento por tenant en dos capas, testing obligatorio, ESLint, Husky y CI.

Esto es lo que se **copia** para cada SaaS nuevo. El razonamiento detrás de cada decisión está en
`../saas-standards/docs/arquitectura-estandar.md`.

## Cómo funciona el backend (si vienes de Express)

No hay servidor aparte. Next.js hace las dos cosas en un mismo proyecto:

- `app/(dashboard)/**/page.tsx` → **frontend**, corre en el navegador.
- `app/api/**/route.ts` → **backend**, corre en el servidor. Tiene acceso a la base de datos y a
  los secretos; el usuario nunca ve ese código.

La ruta la define la carpeta (`app/api/materiales/route.ts` responde en `/api/materiales`) y el
método HTTP lo define el nombre de la función exportada (`GET`, `POST`, `PATCH`, `DELETE`).
No hay `app.listen()`: Vercel convierte cada `route.ts` en una función que se ejecuta sola.

## Pasos para arrancar un SaaS nuevo

### 1. Crear el repo

"Use this template" en GitHub, o clona esta carpeta, borra `.git/` y corre `git init`.

### 2. Crear el proyecto de Supabase

En [supabase.com](https://supabase.com), crea un proyecto nuevo. Después copia `.env.example` a
`.env.local` y llénalo:

- `DATABASE_URL` → Settings → Database → Connection string
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` → Settings → API (nunca la expongas en el cliente)

Si falta alguna variable, la app falla al arrancar con un mensaje claro (`lib/env.ts`), en vez de
romperse a mitad de una petición.

### 3. Instalar dependencias

```bash
npm install
```

Corre `prisma generate` (postinstall) y activa el hook de Husky. Si el repo aún no tenía `.git`,
corre `npx husky` de nuevo después de `git init`.

### 4. Crear las tablas

```bash
npx prisma migrate dev --name init
```

Luego **aplica las políticas de RLS**: abre el SQL Editor de Supabase, pega el contenido de
`prisma/policies/rls.sql` y ejecútalo. Este paso es fácil de olvidar y es la segunda capa de
protección contra fugas de datos entre clientes.

### 5. Verificar que todo funciona

```bash
npm run verify   # lint + typecheck + test + build
npm run dev
```

Abre `http://localhost:3000` → te redirige a `/login`. Ve a `/signup`, crea una cuenta: eso crea
tu identidad en Supabase Auth, más un `Tenant` y un `User` ADMIN en tu base de datos, en una sola
transacción.

### 6. Diseñar tu dominio

`prisma/schema.prisma` trae `Tenant` y `User` (la base que no cambia) y `Material` (módulo de
ejemplo). Agrega tus entidades debajo del marcador, siguiendo las reglas anotadas ahí.

Para que Claude te ayude con este paso, usa `../saas-standards/prompts/kickoff-nuevo-saas.md`.

### 7. Conectar el despliegue automático

1. En [vercel.com](https://vercel.com), importa el repo de GitHub. Vercel detecta Next.js solo.
2. Copia las variables de `.env.local` a Vercel → Settings → Environment Variables.
3. **Protege la rama `main`**: GitHub → Settings → Branches → Add rule → marca "Require status
   checks to pass" y selecciona el check **CI**. Esto es lo que hace seguro el deploy automático:
   sin CI en verde no hay merge, y sin merge no hay deploy.
4. Agrega el secreto `DIRECT_DATABASE_URL` en GitHub → Settings → Secrets (la connection string
   directa de Supabase, puerto 5432). El workflow `deploy.yml` lo usa para aplicar migraciones.
5. **Activa el tope de gasto** en Vercel y en Supabase. Hazlo hoy, no después.

A partir de aquí: cada PR genera un preview desplegado, y cada merge a `main` despliega a
producción y aplica las migraciones pendientes.

### 8. Conectar las herramientas de Claude (MCP)

`.mcp.json` ya viene configurado con Supabase, Vercel, GitHub y Playwright. Solo edita el
`project_ref` de Supabase para apuntar a **tu proyecto de desarrollo** (nunca el de producción) y
autentica con `/mcp` dentro de Claude Code.

### 9. Renombrar y personalizar

- `package.json`: cambia `"name"`.
- `app/layout.tsx`: llena `[NOMBRE_DEL_SAAS]`.
- `CLAUDE.md`: llena todos los `[corchetes]` — es lo que le da contexto a Claude Code en cada sesión.
- **No cambies** `tailwind.config.ts` ni los tokens de `app/globals.css`: el design system es
  compartido por toda la cartera y este producto debe verse igual que los demás. Solo cambia
  `productName` y `navItems` en `app/(dashboard)/layout.tsx`.

### 10. Borrar el módulo de ejemplo

Cuando ya no lo necesites como referencia: `features/materiales/`,
`app/api/materiales/`, `app/(dashboard)/materiales/`, y el modelo `Material` + enum
`MeasurementUnit` del schema y su política en `rls.sql`.

## Documentación operativa incluida

- `docs/adr/` — decisiones de arquitectura con su razonamiento (por qué Vercel y no Netlify, por
  qué multi-tenancy por columna). Lee antes de cuestionar una decisión fundamental.
- `docs/runbook.md` — rollback de un deploy, restaurar backups, migración fallida, sospecha de
  fuga entre tenants, factura inesperada. Llena los `[corchetes]` con los datos de tu proyecto.

## Estructura

```
app/
├── (auth)/login, signup     → páginas públicas
├── (dashboard)/             → páginas protegidas
└── api/**/route.ts          → backend delgado: valida y delega a features/

features/<dominio>/          → una carpeta por dominio de negocio
├── schemas.ts, service.ts, service.test.ts, components/

lib/                         → genérico: prisma, supabase/, tenant-context, env, api-response
components/ui/               → primitivos sin marca
prisma/                      → schema, policies/rls.sql, seed
e2e/                         → Playwright
```

Regla: si el código sabe qué es una "cotización", va en `features/`. Si no sabe nada del negocio,
va en `lib/` o `components/ui/`.

## Seguridad: dos capas de aislamiento

1. **Aplicación**: `getTenantContext()` deriva el tenant de la sesión de Supabase (nunca de input
   del cliente), y todo servicio filtra por `tenantId`.
2. **Base de datos**: las políticas RLS de `prisma/policies/rls.sql` bloquean el acceso cruzado
   aunque una query nueva olvide el filtro.

`features/materiales/service.test.ts` contiene los tests que verifican la capa 1 — cópialos para
cada entidad nueva.

## Estado de verificación

`npm run lint`, `npm run typecheck` y `npm run test` (9 tests) pasan limpio tal como está
empaquetado. `next build` compila correctamente; la recolección de datos de página requiere
`prisma generate`, que corre solo en `npm install` (postinstall) en cualquier máquina con acceso
normal a internet.
