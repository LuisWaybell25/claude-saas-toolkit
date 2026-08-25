# saas-standards

Este repo **no se copia ni se clona para arrancar un SaaS** — es la referencia que consultas antes
y durante. Vive por separado de `saas-template` (el que sí se copia) a propósito: aquí está el
*por qué*, allá está el *qué*.

## Contenido

- `docs/arquitectura-estandar.md` — el documento completo: stack, infraestructura, seguridad,
  multi-tenancy, testing, costos, y el criterio de decisión detrás de cada elección. Es la fuente
  de verdad; si algo en `saas-template` contradice este documento, el documento gana y el template
  se corrige.
- `prompts/kickoff-nuevo-saas.md` — plantilla para el primer mensaje a Claude al arrancar un SaaS
  nuevo (en claude.ai o en Claude Code).
- `ejemplos/caso-cotizador-imprentas.md` — análisis de mercado y proyección financiera del producto
  #1. Es contenido de negocio de un producto específico (no arquitectura), guardado aquí como
  plantilla del tipo de análisis que conviene hacer antes de fijar precio en cada producto nuevo.

## Cómo se usa

1. **Antes de arrancar un SaaS nuevo**: lee (o relee) `docs/arquitectura-estandar.md`, especialmente
   la sección 14 ("Cómo arrancar un producto nuevo") y la 15 ("Contexto para Claude y para el
   equipo").
2. **Al arrancar**: llena la plantilla de `prompts/kickoff-nuevo-saas.md` y pégala como primer
   mensaje en un Proyecto de Claude nuevo, o en Claude Code ya dentro del repo creado desde
   `saas-template`.
3. **Durante el desarrollo**: si Claude o alguien del equipo aprende algo que debería aplicar a
   todos los SaaS futuros (una mejor forma de validar algo, un patrón de seguridad nuevo), se
   corrige primero aquí — y después se decide si vale la pena aplicarlo retroactivamente a los SaaS
   ya existentes. Nunca al revés.

## Mantenimiento

Este documento no es estático. Actualízalo cuando:
- Cambien los precios de Vercel/Supabase/AWS de forma significativa (revisar cada 6-12 meses).
- Se tome una decisión de arquitectura nueva que aplique a todos los productos.
- Se corrija una vulnerabilidad o mal patrón que valga la pena que ningún SaaS futuro repita.
