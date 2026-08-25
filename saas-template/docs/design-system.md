# Design system

Sistema visual **único y compartido** por todos los SaaS de la cartera. No es una base que cada
producto tematiza libremente: es la casa visual de la empresa.

**Qué significa en la práctica**: el cotizador para imprentas y el sistema para nutriólogos se ven
como productos de la misma familia. Mismos componentes, mismos colores, mismo comportamiento. Un
desarrollador que cambia de proyecto no reaprende nada, y un cliente que use dos de tus productos
los reconoce como tuyos.

**Lo único que varía por producto**: el nombre y el logotipo en la barra lateral, y los elementos de
navegación. Nada más. Si un producto necesita romper el sistema, es señal de que al sistema le falta
algo — se agrega aquí, no se improvisa allá.

---

## 1. Tokens de color

Definidos en `app/globals.css` como variables CSS, en formato HSL "pelado" (`184 68% 26%`, sin
`hsl()`). Eso permite que Tailwind aplique opacidad: `bg-primary/10` funciona; con `hsl()` no.

### Superficies

| Token | Utilidad Tailwind | Para qué |
|---|---|---|
| `--background` | `bg-background` | Fondo de la página |
| `--foreground` | `text-foreground` | Texto principal |
| `--card` | `bg-card` | Superficies elevadas: tarjetas, paneles, barra lateral |
| `--card-foreground` | `text-card-foreground` | Texto sobre tarjetas |
| `--popover` | `bg-popover` | Capas flotantes: menús, selects, diálogos |
| `--muted` | `bg-muted` | Fondos sutiles: fondo de barra de progreso, filas alternas |
| `--muted-foreground` | `text-muted-foreground` | Texto secundario, etiquetas, descripciones |
| `--accent` | `bg-accent` | Elemento activo en navegación, resaltados suaves |

### Acción y estado

| Token | Cuándo usarlo |
|---|---|
| `--primary` | Acción principal de la pantalla, navegación activa, anillo de foco |
| `--secondary` | Acción secundaria (típicamente "Cancelar") |
| `--success` | Confirmaciones, estados completados, variaciones favorables |
| `--warning` | Requiere atención pero no bloquea |
| `--destructive` | Errores y acciones irreversibles |
| `--info` | Contexto neutral, ayuda |

### Estructura

`--border` (bordes y divisores), `--input` (bordes de campos), `--ring` (anillo de foco), `--radius`
(radio base; `sm`/`md`/`lg` se derivan de él).

**Cada color de fondo tiene su `-foreground`.** El par garantiza contraste legible sin pensarlo:
`bg-primary text-primary-foreground` funciona en claro y en oscuro.

### El primario

Petróleo profundo (`184 68% 26%`), deliberadamente **no** índigo ni violeta: es la elección
consciente de no verse como el dashboard genérico por defecto.

---

## 2. Modo claro y oscuro

Funciona cambiando la clase `dark` en `<html>` (lo hace `next-themes`), lo que redefine las mismas
variables. **Ningún componente tiene lógica de tema** — leen tokens y ya.

Reglas al agregar un color nuevo:

1. Se define en `:root` **y** en `.dark`. Los dos, siempre.
2. En oscuro el color normalmente **sube en luminosidad**, no se invierte. El primario pasa de 26% a
   46%: un tono que funciona sobre blanco casi nunca tiene contraste suficiente sobre negro.
3. Se verifica el contraste en ambos modos antes de darlo por bueno.

El selector tiene tres estados: claro, oscuro y **sistema**. Sistema es el default — respeta lo que
la persona ya configuró en su dispositivo.

---

## 3. Tipografía

Dos familias de Google Fonts, autohospedadas por Next.js con `next/font/google`.

- **Plus Jakarta Sans** — interfaz y títulos.
- **IBM Plex Mono** (`font-mono`) — folios, códigos, identificadores. Todo lo que se lee carácter por
  carácter.

### Escala

Definida en `tailwind.config.ts`. Usa estos tamaños, nunca valores sueltos:

| Clase | Uso típico |
|---|---|
| `text-2xs` | Metadatos muy secundarios |
| `text-xs` | Pistas de formulario, badges, encabezados de tabla |
| `text-sm` | Interfaz por defecto: botones, celdas, descripciones |
| `text-base` | Cuerpo de lectura |
| `text-lg` / `text-xl` | Títulos de sección y de tarjeta |
| `text-2xl` / `text-3xl` | Títulos de pantalla y cifras de KPI |

Los tamaños grandes ya traen `letter-spacing` negativo — a mayor tamaño, menos espaciado, o el
título se ve suelto.

### Números tabulares

La clase `.tabular` y todas las celdas de tabla usan `font-variant-numeric: tabular-nums`, para que
las cifras aliñen verticalmente. En un cotizador o un panel financiero es funcional: una columna de
montos desalineada es notablemente más difícil de escanear.

Formatea siempre con `toLocaleString("es-MX")`.

### Por qué `next/font` y no el CDN de Google

El argumento clásico a favor del CDN era el caché compartido entre sitios. **Dejó de ser cierto en
2020**: Chrome, Firefox y Safari particionan el caché HTTP por sitio para evitar rastreo, así que la
fuente se descarga igual — pero además pagas DNS y handshake TLS contra dos dominios extra antes de
que empiece la descarga.

Con `next/font/google` la fuente se descarga en build y se sirve desde tu propio dominio: una
conexión externa menos, **cero salto de layout** (Next calcula las métricas de la fuente de
respaldo), funciona sin depender de Google, y no envía la IP del visitante a terceros.

---

## 4. Responsive: mobile-first

El estilo base es para móvil y cada breakpoint **agrega**, nunca resta: `p-4 md:p-6`, nunca
`p-6 sm:p-4`.

| Franja | Prefijo | Ancho |
|---|---|---|
| Móvil | (sin prefijo) | < 768px |
| Tablet | `md:` | ≥ 768px |
| Escritorio | `lg:` | ≥ 1024px |
| Pantalla grande | `xl:` | ≥ 1280px |

### Patrones establecidos

**Navegación** — `AppShell` la resuelve: cajón deslizable en móvil y tablet, barra lateral fija desde
`lg`. Se cierra sola al navegar y con Escape.

**Rejillas** — una columna en móvil, dos en tablet, tres en escritorio:
`grid gap-4 md:grid-cols-2 lg:grid-cols-3`

**Espaciado** — `p-4` en móvil, `md:p-6` de tablet en adelante. Espaciado generoso en pantallas
chicas desperdicia el poco espacio disponible.

**Áreas táctiles** — mínimo 40px de alto en cualquier control. `Button` e `Input` ya lo cumplen.

**Tablas** — se desplazan horizontalmente en móvil en vez de comprimir columnas. Para más de ~4
columnas, tarjetas en móvil y tabla desde `md`:

```tsx
<div className="md:hidden">{/* tarjetas */}</div>
<div className="hidden md:block">{/* tabla */}</div>
```

**Diálogos** — `DialogContent` se ancla abajo y a ancho completo en móvil (más cómodo para el pulgar)
y se centra desde `md`. Ya viene resuelto.

**Botones de diálogo** — `DialogFooter` los apila en orden inverso en móvil (`flex-col-reverse`),
para que la acción principal quede arriba, al alcance del dedo.

---

## 5. Inventario de componentes

Todo en `components/ui/`. **Antes de escribir uno nuevo, revisa si ya existe.**

### Estructura de pantalla

| Componente | Notas |
|---|---|
| `AppShell` | Barra lateral + superior + contenido. Recibe `navItems` y `productName` |
| `PageHeader` | Título, descripción y acciones. **Úsalo en todas las pantallas** |
| `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) | Contenedor estándar |
| `Separator` | Divisor horizontal o vertical |

### Acción

| Componente | Notas |
|---|---|
| `Button` | Variantes `primary`, `secondary`, `outline`, `ghost`, `destructive`. Tamaños `sm`, `md`, `lg`, `icon`. Prop `loading` |
| `DropdownMenu` | Menú de acciones; `DropdownMenuItem` acepta `destructive` |
| `Dialog` | Modal accesible (foco atrapado, Escape, portal), responsive de fábrica |

### Formularios

| Componente | Notas |
|---|---|
| `Input` | Etiqueta, pista y error integrados, con `aria-describedby` y `aria-invalid` conectados |
| `Field` | Envoltorio etiqueta + control + error para lo que no trae etiqueta propia |
| `Label` | Con marca de requerido opcional |
| `Textarea` | Con estado de error |
| `Select` | Desplegable accesible, navegable con teclado |
| `Checkbox` | Soporta estado indeterminado |
| `Switch` | Interruptor encendido/apagado |

### Datos y estado

| Componente | Notas |
|---|---|
| `Table` + `TableNumericCell` | Desplazamiento horizontal en móvil; celda numérica alineada a la derecha |
| `StatCard` | KPI con cifra, variación e ícono. La dirección la decides tú — "arriba" no siempre es bueno (los gastos, por ejemplo) |
| `Progress` / `StackedProgress` | Barra simple o segmentada, con tonos semánticos |
| `Badge` | Etiqueta de estado con tonos semánticos |
| `Alert` | Mensaje con ícono y tono; `role="alert"` solo en errores |
| `Avatar` | Con imagen o iniciales de respaldo |
| `Spinner` | Carga, con texto para lectores de pantalla |
| `Skeleton` | Placeholder de carga (ejemplo del patrón CSS Module) |
| `EmptyState` | Pantalla vacía con título, descripción y acción |
| `Pagination` | Con conteo "X–Y de Z" |
| `Tabs` | Con desplazamiento horizontal en móvil |

La página `/design-system` los muestra todos funcionando — es la referencia viva.

---

## 6. Cuándo usar cada color semántico

El color comunica significado, no decora. La regla es por **qué significa**:

| Situación | Token |
|---|---|
| Acción principal de la pantalla | `primary` |
| Confirmación, completado, variación favorable | `success` |
| Requiere atención sin bloquear (48h sin respuesta, stock bajo) | `warning` |
| Error, validación fallida, acción irreversible | `destructive` |
| Contexto neutral, ayuda | `info` |

**Nunca comuniques estado solo por color.** Un badge rojo también dice "Vencida"; el elemento de
navegación activo tiene fondo **y** riel lateral. Cerca del 8% de los hombres tiene alguna
deficiencia en la percepción del color.

---

## 7. Escritura en la interfaz

Los textos son parte del sistema:

- **Español, voz activa.** El botón dice qué pasa: "Guardar cambios", no "Enviar".
- **El mismo nombre en todo el flujo.** Si el botón dice "Publicar", la confirmación dice
  "Publicado".
- **Los errores explican qué pasó y cómo arreglarlo**, sin disculparse ni ser vagos: "El costo por
  m² debe ser mayor a cero", no "Datos inválidos".
- **Las pantallas vacías invitan a actuar**, no solo informan que no hay nada.
- Sentence case en todo: botones, títulos, etiquetas.

---

## 8. Accesibilidad de base

Ya está en los componentes:

- Anillo de foco visible y consistente (`:focus-visible` global).
- Enlace "Saltar al contenido" en el shell.
- `aria-current="page"` en la navegación activa.
- Etiquetas asociadas, errores vía `aria-describedby`, `aria-invalid` en campos con error.
- Diálogos y menús con foco atrapado y cierre con Escape.
- `prefers-reduced-motion` respetado globalmente.
- Nunca estado comunicado solo por color.

---

## 9. Reglas al construir UI

**Colores** — solo tokens: `bg-primary`, `text-muted-foreground`, `border-border`. Nunca
`bg-[#0F6E6E]` ni `text-gray-500`. Una regla de ESLint bloquea los literales.

**Si necesitas un color que no existe** — agrégalo primero a `app/globals.css` (en `:root` y `.dark`)
y a `tailwind.config.ts`, y menciónalo: es un cambio al sistema, no a una pantalla.

**Componentes** — revisa `components/ui/` antes de escribir uno nuevo. Si el que existe no alcanza,
extiéndelo ahí en vez de crear una variante local.

**Modo oscuro** — no lo pruebes al final. Con tokens funciona solo; con un color literal se rompe y
no te enteras hasta que un cliente lo reporte.

**Lo que Tailwind no cubre bien** (`@keyframes`, selectores complejos, `@media print`): un
`<componente>.module.css` junto al componente, tomando valores de los tokens vía `theme()`. **No usar
Sass** — CSS nativo ya tiene variables, anidamiento y `@layer`, y Tailwind resuelve la composición.

---

## 10. Cómo se hace cumplir

Tres capas, de contexto a obligación:

1. **`CLAUDE.md` referencia este documento con `@docs/design-system.md`**, así que Claude Code lo
   carga en cada sesión.
2. **El skill `.claude/skills/nueva-pantalla/`** se activa al construir UI y trae el procedimiento.
3. **La regla de ESLint bloquea colores literales** con un error que explica la alternativa. Esta es
   la capa que obliga: las dos anteriores son contexto que un modelo o una persona podrían no
   seguir; esta rompe el commit y el CI.

Mismo principio que con el testing: el contexto ayuda, pero lo que debe cumplirse vive en el linter.

---

## 11. Evolucionar el sistema

Cuando un producto necesita algo que el sistema no tiene:

1. **No lo improvises en ese producto.** Un componente local con estilos propios es cómo un sistema
   compartido empieza a divergir.
2. **Agrégalo aquí**, en `saas-template`, con su documentación y su ejemplo en `/design-system`.
3. **Decide si llevarlo** a los productos existentes. No se propaga solo.

Si la misma "excepción" aparece en dos productos, no es una excepción: es una pieza faltante del
sistema.
