---
name: nueva-pantalla
description: Use when building any UI in this project — a new page, form, table, dashboard view, modal, or when restyling existing screens. Triggers on requests like "crea la pantalla de X", "agrega un formulario para X", "haz la vista de X", "diseña el dashboard de X".
---

# Construir una pantalla con el design system

Este proyecto tiene un design system completo. Construir UI aquí es **componer lo que ya existe**,
no diseñar desde cero. Referencia: `docs/design-system.md`.

## Antes de escribir código

1. **Revisa `components/ui/`** — Button, Card, Input, Badge, Alert, Table, Skeleton ya existen con
   sus variantes. No escribas un botón nuevo.
2. **Abre `/design-system`** (o su archivo en `app/(dashboard)/design-system/page.tsx`) para ver
   los componentes en uso real y copiar el patrón.
3. **Si la pantalla va dentro del dashboard**, no construyas navegación: `AppShell` ya la resuelve.
   Solo agrega el elemento a `navItems` en `app/(dashboard)/layout.tsx`.

## Reglas al construir

**Colores** — solo tokens. `bg-primary`, `text-muted-foreground`, `border-border`. Nunca
`bg-[#0F6E6E]` ni `text-gray-500`.

El design system es **compartido y fijo** entre todos los productos de la cartera: no ajustes la
paleta ni la tipografía para que una pantalla se vea "mejor". Si de verdad falta un token, agrégalo
a `app/globals.css` (en `:root` **y** en `.dark`) y a `tailwind.config.ts`, y **dilo explícitamente**
en tu respuesta — es un cambio que afecta a todos los productos, no a esta pantalla.

**Estados semánticos** — usa el token que corresponde al significado, no al color que se te ocurra:
`success` para confirmaciones, `warning` para avisos, `destructive` para errores y acciones
irreversibles, `info` para contexto neutral.

**Responsive mobile-first** — escribe el estilo móvil primero y agrega con breakpoints:
- `p-4 md:p-6` ✅ — nunca `p-6 sm:p-4` ❌
- Rejillas: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- Tablas de más de ~4 columnas: tarjetas en móvil (`md:hidden`) y tabla desde `md` (`hidden md:block`)
- Cualquier control interactivo: mínimo 40px de alto

**Modo oscuro** — no lo pruebes "después". Si usas tokens, funciona solo. Si escribiste un color
literal, se rompe en oscuro y no te vas a dar cuenta hasta que un cliente lo reporte.

**Cifras** — montos y cantidades van con la clase `.tabular` o en `TableNumericCell`, alineados a
la derecha. Formatea con `toLocaleString("es-MX")`.

**Accesibilidad** — etiqueta en cada campo (el componente `Input` ya la conecta con su error),
`aria-current` en navegación, y nunca comuniques estado solo por color (agrega texto o ícono).

**Textos** — español, voz activa, y el botón dice exactamente qué pasa: "Guardar cambios", no
"Enviar". Estados vacíos que invitan a actuar, no que solo informan que no hay nada.

## Antes de dar por terminado

- `npm run lint` — hay una regla que bloquea colores literales en clases.
- Revisa la pantalla en móvil (< 768px) y en modo oscuro. Los dos, no uno.
