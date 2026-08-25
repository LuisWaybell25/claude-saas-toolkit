-- ================================================================
-- ROW LEVEL SECURITY (RLS) — segunda capa de aislamiento entre tenants
--
-- Cómo aplicarlo: pega este archivo en el SQL Editor de Supabase
-- (o córrelo con `psql`) DESPUÉS de la primera migración de Prisma.
--
-- ¿Por qué existe si el código ya filtra por tenantId?
-- Porque el filtro en el código depende de que nadie lo olvide nunca.
-- Estas políticas son la red que atrapa el error humano: si alguien
-- escribe una query nueva sin `where tenantId`, Postgres igual bloquea
-- el acceso cruzado. Defensa en profundidad (sección 9-11 del doc).
--
-- IMPORTANTE: la connection string que usa Prisma con la SERVICE ROLE key
-- ignora RLS por diseño (es una conexión de superusuario). Estas políticas
-- protegen el acceso desde el cliente de Supabase (navegador, anon key).
-- Por eso NO reemplazan el filtro por tenantId en tus route handlers:
-- las dos capas se necesitan.
-- ================================================================

-- ----------------------------------------------------------------
-- Función auxiliar: devuelve el tenantId del usuario autenticado
-- ----------------------------------------------------------------
create or replace function public.current_tenant_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select "tenantId"
  from public.users
  where "authUserId" = auth.uid()::text
    and active = true
  limit 1;
$$;

-- ----------------------------------------------------------------
-- TENANTS: un usuario solo ve su propio tenant
-- ----------------------------------------------------------------
alter table public.tenants enable row level security;

drop policy if exists "tenant_select_own" on public.tenants;
create policy "tenant_select_own"
  on public.tenants for select
  using (id = public.current_tenant_id());

drop policy if exists "tenant_update_own" on public.tenants;
create policy "tenant_update_own"
  on public.tenants for update
  using (id = public.current_tenant_id());

-- ----------------------------------------------------------------
-- USERS: solo los usuarios del mismo tenant
-- ----------------------------------------------------------------
alter table public.users enable row level security;

drop policy if exists "users_select_same_tenant" on public.users;
create policy "users_select_same_tenant"
  on public.users for select
  using ("tenantId" = public.current_tenant_id());

drop policy if exists "users_update_same_tenant" on public.users;
create policy "users_update_same_tenant"
  on public.users for update
  using ("tenantId" = public.current_tenant_id());

-- ----------------------------------------------------------------
-- MATERIALS (tabla de ejemplo) — el patrón a repetir en CADA tabla
-- de negocio nueva que agregues al schema.
-- ----------------------------------------------------------------
alter table public.materials enable row level security;

drop policy if exists "materials_tenant_isolation" on public.materials;
create policy "materials_tenant_isolation"
  on public.materials for all
  using ("tenantId" = public.current_tenant_id())
  with check ("tenantId" = public.current_tenant_id());

-- ================================================================
-- AGREGA AQUÍ LAS POLÍTICAS DE TUS TABLAS NUEVAS
--
-- Plantilla para copiar (reemplaza <tabla>):
--
--   alter table public.<tabla> enable row level security;
--
--   drop policy if exists "<tabla>_tenant_isolation" on public.<tabla>;
--   create policy "<tabla>_tenant_isolation"
--     on public.<tabla> for all
--     using ("tenantId" = public.current_tenant_id())
--     with check ("tenantId" = public.current_tenant_id());
--
-- Regla: NINGUNA tabla con columna tenantId debe quedarse sin política.
-- ================================================================
