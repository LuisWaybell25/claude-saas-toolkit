# Runbook de operaciones

Qué hacer cuando algo sale mal en producción. Escrito para que sirva a las 2am, cuando nadie
quiere razonar desde cero.

> Llena los `[corchetes]` con los datos reales de este proyecto al crearlo.

**Datos del proyecto**
- Proyecto de Vercel: `[URL del dashboard]`
- Proyecto de Supabase: `[URL del dashboard]`
- Dominio de producción: `[dominio]`
- Contacto de guardia: `[quién]`

---

## 1. El sitio está caído o devuelve error 500

**Primero, ubica dónde está el problema:**

1. Revisa `https://[dominio]/api/health` — si responde `{"status":"ok"}`, la app está viva y el
   problema es de una ruta específica o de la base de datos.
2. Revisa el estado de las plataformas: `vercel-status.com` y `status.supabase.com`. Si es una
   caída de proveedor, no hay nada que arreglar del lado nuestro — comunica y espera.
3. Logs de Vercel: dashboard → proyecto → Logs. Filtra por errores de las últimas horas.

**Si el problema empezó justo después de un deploy → haz rollback (sección 2).**

---

## 2. Rollback de un deploy malo

Vercel guarda todos los deploys anteriores y puede promover uno viejo a producción en segundos.

1. Dashboard de Vercel → proyecto → **Deployments**.
2. Busca el último deploy que funcionaba (los previos a la falla).
3. Menú `⋯` → **Promote to Production**.

Toma unos segundos y no requiere volver a construir.

**⚠️ Cuidado con las migraciones**: si el deploy malo incluyó una migración de base de datos que
cambió el esquema (borró una columna, renombró una tabla), el rollback del código **no** revierte
la base de datos. El código viejo puede fallar contra el esquema nuevo. En ese caso:

- Si la migración solo **agregó** cosas (columnas nuevas, tablas nuevas): el rollback es seguro,
  el código viejo simplemente las ignora.
- Si la migración **quitó o renombró** algo: escribe una migración correctiva hacia adelante en
  vez de intentar revertir. Revertir migraciones destructivas en producción casi siempre empeora
  las cosas.

Por eso la regla: **las migraciones destructivas se hacen en dos pasos separados por al menos un
deploy** (primero agregar lo nuevo y dejar de usar lo viejo; después, en otro deploy, borrar lo
viejo).

---

## 3. Restaurar un backup de la base de datos

Supabase Pro incluye backups diarios con 7 días de retención.

1. Dashboard de Supabase → proyecto → **Database** → **Backups**.
2. Elige el punto de restauración y confirma.

**Antes de restaurar, entiende el costo**: restaurar revierte la base **completa** al momento del
backup — se pierde todo lo que los clientes hicieron desde entonces. Casi nunca es la respuesta
correcta para un bug puntual.

**Alternativa preferible para daño acotado** (ej. un cliente borró sus datos por error): exporta
solo las filas afectadas del backup y reinsértalas, en vez de revertir toda la base.

Si el proyecto ya tiene clientes con datos críticos, considera activar **Point-in-Time Recovery**
(add-on de Supabase) — permite restaurar a un minuto específico, no solo al backup diario.

---

## 4. Una migración falló a medias

1. Revisa el log del workflow `Deploy` en GitHub Actions para ver en qué paso falló.
2. `npx prisma migrate status` contra la base de producción (con la connection string directa)
   dice qué migraciones están aplicadas y cuáles no.
3. Si una migración quedó marcada como fallida: `npx prisma migrate resolve --rolled-back
   <nombre_migracion>`, corrige el SQL, y vuelve a desplegar.
4. **Nunca** edites una migración ya aplicada en producción — escribe una nueva que corrija.

---

## 5. Sospecha de fuga de datos entre tenants

Esto es lo más grave que puede pasar en un SaaS multi-tenant. Actúa en este orden:

1. **Contén**: si sabes qué endpoint es, desactívalo (comenta la ruta y despliega, o usa un feature
   flag si existe). Es preferible una funcionalidad caída a datos filtrándose.
2. **Confirma el alcance**: revisa los logs de Vercel para ver qué peticiones tocaron ese endpoint
   y desde qué usuarios.
3. **Corrige**: casi siempre es un `where` sin `tenantId` o un `tenantId` leído de input del
   cliente. Corre el subagente `revisor-aislamiento-tenant` sobre el código relacionado.
4. **Verifica que RLS estaba activo**: si las políticas de `prisma/policies/rls.sql` no se
   aplicaron en ese proyecto, la segunda capa de defensa no existía. Aplícalas.
5. **Agrega el test que faltaba** en `features/<dominio>/service.test.ts` antes de cerrar el
   incidente — así ese bug específico no puede volver.
6. **Comunica** a los clientes afectados según lo que exija la regulación aplicable.

---

## 6. Factura inesperadamente alta

1. Vercel → **Usage**: identifica qué métrica se disparó (transferencia, cómputo, invocaciones).
2. Supabase → **Reports**: revisa cómputo y almacenamiento.
3. Causas típicas: un bug que genera un bucle de peticiones, imágenes sin optimizar servidas en
   volumen, o un cron mal configurado.
4. **Prevención**: el tope de gasto (spend cap) debe estar activo en ambas plataformas desde el
   día uno del proyecto. Si no lo está, actívalo ahora.

---

## 7. Alguien perdió acceso / hay que sacar a alguien del equipo

- **Acceso a la app**: marca `active: false` en su fila de la tabla `users` — `getTenantContext()`
  rechaza usuarios inactivos, así que pierde acceso de inmediato sin borrar su historial.
- **Acceso a las plataformas**: Vercel → Team → Members; Supabase → Organization → Team; GitHub →
  Settings → Collaborators.
- **Rota los secretos** si esa persona tenía acceso a variables de entorno de producción:
  `SUPABASE_SERVICE_ROLE_KEY`, tokens de acceso personal, y cualquier llave de terceros.
