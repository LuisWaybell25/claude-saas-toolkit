# claude-saas-toolkit

Todo lo necesario para arrancar un SaaS B2B multi-tenant con la misma arquitectura, las mismas
convenciones de seguridad, y el mismo nivel de contexto para Claude — sin importar quién del equipo
lo arranque.

> **Sobre el nombre**: "claude-saas-toolkit" describe exactamente lo que es (un kit de arranque para
> SaaS, con piezas específicas de Claude Code: `CLAUDE.md`, skills, agentes). Cuando definas el
> nombre de la empresa, renombrar esta carpeta y el repo es trivial — ningún código depende de él.

## Qué hay aquí

```
claude-saas-toolkit/
├── saas-standards/     # el "por qué" — documentación, se consulta, no se copia
└── saas-template/      # el "qué" — código real, SE COPIA para cada SaaS nuevo
```

**`saas-standards/`** — la referencia de la arquitectura definida (stack, estructura, seguridad,
multi-tenancy, testing, costos en pesos), la plantilla de prompt para arrancar conversaciones con
Claude, y ejemplos de análisis de negocio por producto. El *razonamiento* detrás de las decisiones
grandes vive en los ADRs del template (`saas-template/docs/adr/`).

**`saas-template/`** — el boilerplate real y verificado: Next.js 14 + Supabase (Postgres + Auth) +
Prisma + Tailwind + Zod, con login/signup funcionando, aislamiento por tenant en dos capas, un
módulo CRUD de ejemplo, testing, ESLint, Husky y CI.

## El stack, en una línea

**TypeScript** sobre **Node.js**, en **Next.js 14** (frontend y backend en el mismo proyecto — el
backend son los route handlers de `app/api/**/route.ts`, sin Express ni servidor aparte), con
**PostgreSQL vía Supabase** y **Prisma** como ORM, desplegado en **Vercel**.

## Cómo usar esto si eres nuevo en el equipo

1. **Lee primero** `saas-standards/docs/arquitectura-estandar.md` — completo si vas a tomar
   decisiones de arquitectura, o al menos las secciones 1-2 (stack y estructura de repo), 4-6
   (autenticación, seguridad y estilos) y 15 (cómo se usa con Claude).
2. **Para arrancar un SaaS nuevo**: sigue `saas-template/README.md` paso a paso — crear el repo,
   configurar Supabase, migrar, aplicar RLS, verificar, personalizar.
3. **Para que Claude te ayude desde el primer mensaje**: llena
   `saas-standards/prompts/kickoff-nuevo-saas.md` y pégalo como primer mensaje, en un Proyecto de
   Claude (claude.ai) o en Claude Code dentro del repo nuevo.
4. **En Claude Code**: al abrir el repo, `CLAUDE.md` se carga automáticamente. El skill
   `nuevo-modulo-crud` y el subagente `revisor-aislamiento-tenant` quedan disponibles de una vez.

## Lo que este template ya resuelve por ti

- **Autenticación completa** con Supabase Auth: login, signup, sesión en cookies, rutas protegidas.
- **Registro de tenant**: crear cuenta genera `Tenant` + `User` ADMIN en una transacción.
- **Aislamiento entre clientes en dos capas**: filtro por `tenantId` en la aplicación + políticas
  de Row Level Security en Postgres como red de seguridad.
- **Tests de aislamiento ya escritos**: el test más importante de un SaaS multi-tenant, listo para
  copiar a cada entidad nueva.
- **Módulo CRUD de ejemplo completo** (`features/materiales/`) como referencia viva del patrón.
- **Calidad donde importa**: ESLint con errores para bugs reales y advertencias para estilo,
  Husky en pre-commit, y CI con lint, typecheck, tests y build sobre `main` protegida.

## Herramientas conectadas y operación

- **`.mcp.json`** — configuración compartida de MCPs (Supabase, Vercel, GitHub, Playwright). Se
  commitea, no lleva tokens, y cualquiera del equipo los tiene al clonar el repo.
- **`.vscode/`** — settings del workspace y extensiones recomendadas, para que todos trabajen con
  la misma configuración de editor.
- **`docs/adr/`** — decisiones de arquitectura registradas con su razonamiento y con la condición
  bajo la cual convendría reconsiderarlas.
- **`docs/runbook.md`** — qué hacer ante caídas, rollbacks, migraciones fallidas o una sospecha de
  fuga de datos entre clientes.
- **Despliegue**: merge a `main` → Vercel despliega y GitHub Actions aplica las migraciones. Con la
  rama protegida exigiendo CI, es imposible desplegar código que no pasó los tests.

## Filosofía en una línea

Cada SaaS es un negocio y un repo independiente — lo único que se estandariza es *cómo* se
construyen. Nunca se fuerza que compartan código en tiempo de ejecución ni que vivan en el mismo
repositorio. Ver `saas-standards/docs/arquitectura-estandar.md` sección 11.
