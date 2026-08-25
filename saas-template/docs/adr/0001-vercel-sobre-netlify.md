# ADR-0001: Vercel como plataforma de hosting, sobre Netlify

- **Fecha**: 2026-08-23
- **Estado**: Aceptado

## Contexto

Necesitamos una plataforma de hosting estándar para toda la cartera de SaaS (5-10 productos
proyectados), todos sobre Next.js. La decisión aplica a todos los productos, no a uno solo, así
que un problema de plataforma se multiplica por cada SaaS activo.

## Alternativas consideradas

- **Vercel** — Pro cuesta $20/mes **por asiento**, incluye 1 TB de transferencia. Desarrolla
  Next.js, así que el soporte del framework es de primera mano.
- **Netlify** — Pro cuesta $20/mes **planos con miembros ilimitados** (eliminaron el precio por
  asiento en abril de 2026), pero incluye ~150 GB de transferencia (modelo de créditos). Soporta
  Next.js mediante un adaptador.

En dinero: con un equipo de 3-4 personas y tráfico bajo, Netlify sale ~$40-60/mes más barato.
Con una sola persona y tráfico alto, gana Vercel.

## Decisión

**Vercel**, por soporte de primera mano de Next.js — no por precio.

Next.js lo desarrolla Vercel: cada feature nueva del framework funciona ahí primero y sin
intermediarios. En Netlify pasa por un adaptador que puede quedarse atrás. Con siete productos
sobre el mismo framework, un problema de compatibilidad del adaptador pega en todos a la vez y no
lo podemos resolver nosotros. Ese riesgo pesa más que $40-60/mes contra los márgenes proyectados
(a 50 clientes el producto #1 factura ~$34,000 MXN/mes).

## Consecuencias

- Pagamos por asiento: el costo de hosting crece con el tamaño del equipo, no solo con el tráfico.
- Obtenemos preview deployments por PR y despliegue automático en merge sin configurar nada.
- Activar el tope de gasto (spend cap) desde el día uno en cada proyecto nuevo, sin excepción.

## Cuándo reconsiderar

- Si el equipo crece a 5+ personas **y** el tráfico se mantiene bajo: los asientos ilimitados de
  Netlify empiezan a ganar de verdad ($20 planos vs $100+).
- Si Netlify llega a tener soporte de Next.js verificablemente al día con cada release.

Nota: la migración es de riesgo bajo-medio. La app es Next.js estándar sobre Node — cambiar de
plataforma es reconfigurar el despliegue, no reescribir código.
