# Trace · Sistema de diseño

Sistema de diseño **bloqueado** de Trace. Cualquier agente o persona que escriba UI
lee este archivo primero; sus reglas prevalecen sobre defaults, plantillas y skills
de diseño genéricos.

Adapta los principios anti-slop de Hallmark al medio móvil y los fusiona con las
Human Interface Guidelines de iOS. La regla de diversificación de Hallmark se
**invierte** aquí: en una app las pantallas deben **compartir** el sistema, no
diferenciarse entre sí. La variedad viene del contenido; la estructura es
consistente.

Fuente de verdad de tokens: `src/global.css` (`@theme` de Tailwind v4).
Estilado: NativeWind `className` primero; `style` solo para lo que NativeWind no
cubre (`fontVariant`, colores dinámicos por dato, sombras puntuales).

---

## 1. Identidad y tono

- **Producto:** finanzas personales — registrar y entender el dinero, no moverlo.
- **Tono:** calma financiera. Fondo neutral, texto de alto contraste, un verde
  esmeralda como única voz de marca. Nada grita; los números son los protagonistas.
- **Sensación:** app nativa iOS — háptica sutil, springs, sheets desde abajo,
  safe areas respetadas.
- **Género:** utility warm-minimal. No es una landing page: sin heros
  decorativos, sin secciones de marketing, sin métricas de vanidad.

---

## 2. Color

Dos familias, cero decoración: una **rampa neutral** (`neutral-*` de Tailwind)
que sostiene fondos, superficies y texto en **ambos** temas, y un único **accent
esmeralda** como voz de marca. El hue no cambia entre light y dark — solo la
lightness. Fuente de verdad: `@theme` en `src/global.css`.

### Tokens de marca (`src/global.css`)

| Token | Valor | Rol |
| --- | --- | --- |
| `accent` | `#059669` (emerald-600) | Voz de marca: CTA primaria, estado activo, ingreso |
| `accent-pressed` | `#047857` (emerald-700) | Estado pressed del accent |

Son los **únicos** tokens de color propios. El resto es la paleta nativa de
Tailwind (`neutral-*`, `emerald-*`, `red-*`), disponible sin declarar nada. Se
retiraron los tokens cálidos (`canvas`, `ink`, `ink-soft`, `ink-faint`,
`hairline`, `surface-2`, `glow`, `hero`, `brand`, `dot-idle`) a favor de `neutral`.

### Clases semánticas (`@utility` en `src/global.css`)

Los cuatro roles base viven como utilidades que ya empaquetan su pareja
light/dark — se usan **sin** prefijo `dark:`:

| Clase | Rol | Light | Dark |
| --- | --- | --- | --- |
| `bg-primary` | Fondo de pantalla (`Screen`) | `neutral-100` | `neutral-950` |
| `bg-secundary` | Panel / tarjeta / sheet | `white` | `neutral-900` |
| `text-primary` | Texto primario (default de `<Text>`) | `black` | `white` |
| `text-secundary` | Texto secundario / metadato | `neutral-400` | `neutral-400` |

`text-primary` es el default de `<Text>`: solo se escribe explícito para
restaurarlo tras otro color. `text-secundary` usa `neutral-400` en ambos modos;
su contraste en light es bajo (~2.3:1) → reservarlo a **texto no esencial** (§11).

### Resto de la rampa (light / dark)

Roles sin clase semántica; el hue nunca cambia, solo la lightness:

| Rol | Light | Dark |
| --- | --- | --- |
| Superficie sutil (chip, track, press fantasma) | `bg-neutral-200` | `dark:bg-white/5` |
| Borde / hairline (1px) | `border-neutral-200` | `dark:border-neutral-800` |
| Texto terciario / placeholder | `text-neutral-400` | `dark:text-neutral-600` |
| Accent (CTA, activo, ingreso) | `bg-accent` / `text-accent` | `dark:text-emerald-400` |
| Accent pressed | `active:bg-accent-pressed` | igual |
| Error | `text-red-400` / `border-red-400` | igual en ambos modos |

Como **fondo** (`bg-accent`) el accent no cambia entre modos; como **texto/icono**
sube a `emerald-400` (`#34d399`) en dark para mantener contraste sobre superficie
oscura.

Colores de icono JS-side (prop `color`, sin className) siguen la misma rampa —
primario `#000` / `#fff` · muted `#737373` / `#a3a3a3` · faint `#a3a3a3` /
`#525252` — y espejan `Colors.ts`. Pendiente promoverlos a helper (ver §13).

### Semántica de datos

- **Tendencia arriba / ingreso:** `#34d399` (emerald-400, espeja el accent).
  **Abajo / gasto:** `#f87171` (red-400). Nunca como único canal: siempre con
  icono (flecha) o signo.
- **Tints de categoría:** cada categoría define su `tint` (`src/constants/categories.ts`).
  Fondo activo = `${tint}1f` (~12% alpha), borde activo = `${tint}66` (~40% alpha),
  icono y texto = tint pleno. Ese trío es el patrón de selección por categoría.
  Las tints, los colores de método de pago y los gradientes decorativos del
  balance (`BALANCE_PALETTES`) son color-de-dato/ilustración: viven fuera de la
  rampa neutral y pueden ser hex libres (regla 4).

### Reglas

1. **Un accent.** El esmeralda es la única voz de marca por pantalla. Ocupa poco:
   una FAB, un estado seleccionado, un valor positivo. Máximo **una** acción
   primaria accent por pantalla.
2. **La superficie es neutral.** Fondos y paneles usan las clases semánticas
   `bg-primary` (pantalla) y `bg-secundary` (panel/tarjeta/sheet) — nunca hex ni
   `bg-white` sueltos. El texto sí es negro/blanco puro vía `text-primary`.
3. **El hue no cambia entre modos.** Dark = mismas intenciones, otra lightness.
4. **Color inline solo cuando es dato** (tint de categoría, color de gráfico,
   gradiente de ilustración). Todo lo demás referencia `accent`/`accent-pressed`,
   la rampa `neutral`/`emerald` de Tailwind, o `Colors.ts`.
5. **Prohibido:** gradientes purple→cyan / orange→pink, gradientes de 3 stops,
   accent como fondo de secciones completas, texto gris sobre fondo de color,
   rojo/verde como único diferenciador, reintroducir tokens de color cálidos.

---

## 3. Tipografía

Una sola familia: **Satoshi** (`.otf` locales en `assets/font/`, cargada en
`_layout.tsx` con `useFonts` de `expo-font`), todos los pesos como tokens
`font-satoshi-*`. La jerarquía se construye con **peso y tamaño**, nunca con
itálicas ni decoración.

Pesos disponibles: Light (300) · Regular (400) · Medium (500) · Bold (700) ·
Black (900). **No hay SemiBold (600) ni ExtraBold (800):** el énfasis intermedio
usa `font-satoshi-bold`.

| Rol | Clases | Ejemplo |
| --- | --- | --- |
| Cuerpo (default de `<Text>`) | `font-satoshi text-base` | descripciones |
| Label / chip / botón | `font-satoshi-medium text-sm` | "Categoría", "Hoy" |
| Énfasis / seleccionado | `font-satoshi-bold text-sm` | categoría activa |
| Título de sheet / sección | `font-satoshi-bold text-lg tracking-tight` | "Método de pago" |
| Cifra protagonista | `font-satoshi-bold`, `text-5xl`–`text-6xl`, `tracking-tight` | balance, monto |
| Metadato | `font-satoshi text-xs`–`text-sm` + color secundario | "Balance disponible" |

**Números:**

- Toda cifra monetaria lleva `style={{fontVariant: ['tabular-nums']}}` y `numberOfLines={1}`.
- El tamaño baja con la longitud (regla ya en `expenses/new.tsx`):
  ≤6 dígitos `text-6xl` · 7–9 `text-5xl` · >9 `text-4xl`.

**Prohibido:** headers en itálica (las italic de Satoshi no se cargan), más de
dos pesos en un mismo componente, texto en mayúsculas sostenidas como
eyebrow/sección.

---

## 4. Espaciado, forma y layout

- **Escala 4pt de Tailwind.** Nunca px arbitrarios en spacing.
- **Separar con `gap`, no con `margin`.** Para espaciar elementos hermanos, el
  contenedor lleva `gap-*`; **no** se pone `mb-*` al elemento de arriba (ni `mt-*`
  al de abajo). El default siempre es `gap`. `mb-*`/`mt-*` quedan como último
  recurso, solo cuando `gap` no aplica (un margen aislado sin hermanos, un ajuste
  puntual) — y ahí es válido usarlos con normalidad.
- **Ritmo establecido:** padding horizontal de pantalla `px-5`/`px-6` · gap entre
  chips `gap-2`/`gap-3` · entre bloques `gap-6`/`gap-8`. Variar el gap entre
  niveles (no todo a 24) es lo que da jerarquía.
- **Una columna.** La jerarquía en 390pt de ancho viene de tamaño, peso y
  espacio — no de grids asimétricos. Filas con `flex-row` para chips y stats.

### Radios (lenguaje de forma)

| Forma | Uso |
| --- | --- |
| `rounded-full` | Chips, botones circulares, pills, FAB |
| `rounded-2xl` / `rounded-3xl` | Tarjetas, botones anchos, sheets |
| `rounded-t-[28px]` | Panel inferior anclado |

Solo `borderRadius` (vía clases `rounded-*` de Tailwind). **No** usar
`borderCurve: 'continuous'`: se retiró del proyecto para que iOS y Android
compartan la misma esquina circular (`borderCurve` solo afecta iOS).

### Táctil (HIG)

- Target mínimo **44×44pt**: controles de `h-10 w-10` (40pt) siempre con
  `hitSlop={8}`; la FAB es `h-14 w-14` (56pt).
- Safe areas solo vía `<Screen edges={...}>` y `useSafeAreaInsets()` — nunca
  paddings mágicos.

### Profundidad

La elevación se expresa por **capas de superficie** (`bg-primary` → panel
`bg-secundary` → chip `neutral-200`/`white-5`), no por sombras.
Sombras permitidas:

- *Whisper*: `0 1px 6px rgba(0,0,0,0.05)` (pill flotante) y
  `0 -4px 24px rgba(0,0,0,0.04)` (panel inferior).
- *Glow de FAB*: `0 6px 16px rgba(5,150,105,0.35)` — solo la FAB, solo una vez.

Nada de sombras apiladas ni glows sobre fondo claro. En dark, elevación =
superficie más clara, nunca sombra.

---

## 5. Motion

Todo con **Reanimated**; animar solo `transform` y `opacity`.

| Bucket | Duración | Uso |
| --- | --- | --- |
| Micro | 70–150ms | press, pop de tecla, fades de aparición |
| Menor | 200–300ms | apertura de menú, transición de chip |
| Mayor | 300–450ms | sheets, cambios de pantalla |

- Salidas ≈ 75% de la entrada (`FadeIn.duration(150)` / `FadeOut.duration(120)`).
- **Springs para lo gestual** (sheets, drag, toggles): `withSpring` es idiomático
  en iOS — preferirlo sobre curvas bounce artificiales en timings.
- Recetas canónicas ya en código (`expenses/new.tsx`):
  - *Pop de cifra:* `withSequence(withTiming(1.04, {duration: 70}), withTiming(1, {duration: 110}))` en scale.
  - *Shake de error:* translateX `-7 → 7 → -4 → 0` a 50ms por paso.
- **Reduced motion obligatorio:** en animaciones espaciales nuevas, consultar
  `useReducedMotion()` (Reanimated) y colapsar a crossfade de opacidad.
- **Prohibido:** animar `width`/`height`/`top`/`margin`, loops infinitos fuera
  de loaders, motion decorativo que no comunique un cambio de estado.

---

## 6. Háptica

Escalera exacta (ya implementada, gated a iOS vía `process.env.EXPO_OS === 'ios'`):

| Evento | Llamada |
| --- | --- |
| Tap de tecla / acción ligera | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` |
| Selección en picker / switch | `Haptics.selectionAsync()` |
| Envío exitoso | `Haptics.notificationAsync(NotificationFeedbackType.Success)` |
| Validación fallida | `Haptics.notificationAsync(NotificationFeedbackType.Error)` |

Regla: la háptica **acompaña un cambio de estado**, nunca es decorativa. Un
gesto = un feedback.

---

## 7. Estados interactivos

Todo elemento tocable se diseña con sus estados desde el inicio (no hay hover
en móvil; el press es el lenguaje):

| Estado | Patrón |
| --- | --- |
| Default | superficie según §2 |
| Pressed | `active:opacity-70` (chips/filas) o `active:bg-accent-pressed` (accent) o `active:bg-neutral-200 dark:active:bg-white/5` (targets fantasma) |
| Disabled | `Gradients.disabled` / opacidad reducida + sin háptica |
| Loading | spinner o skeleton en el lugar del contenido, mismo tamaño (sin saltos de layout) |
| Error | `border-red-400` + shake + háptica Error; el mensaje dice qué hacer |
| Success | **silencioso**: háptica Success + navegar/cerrar. Sin toasts de celebración |

La validación es *lazy*: no marcar errores hasta el primer intento de envío
(`attempted`), luego validar en vivo.

---

## 8. Componentes canónicos

Antes de crear UI nueva, reusar o extender estos (`src/components`):

- **`Screen`** — raíz de toda pantalla: fondo, safe areas (`edges`), scroll y
  teclado (`scroll`, `keyboard`, `keyboardOffset`), padding (`padded`).
- **`Text`** — único punto de entrada de texto; default `font-satoshi text-base`.
  Nunca importar `Text` de react-native en pantallas.
- **`SheetModal`** — todo picker/acción secundaria vive en un sheet inferior
  (`rounded-t-3xl`, backdrop `rgba(0,0,0,0.5)`, título + botón cerrar).
- **`TabBar`** — tab bar custom con FAB accent central elevada (`-mt-8`).
- **Patrón Chip** — pill `h-10 rounded-full` con icono 15–16 + label
  `font-satoshi-medium text-sm`; base de filtros, pickers y metadatos.
- **Calendarios** — `MonthCalendar` / `HorizontalCalendar` para toda selección de fecha.

Regla: una variante nueva **extiende** el componente (prop/className), no lo
bifurca. Si un tercer sitio copia-pega un patrón, se promueve a componente.

---

## 9. Iconografía

- **`@tabler/icons-react-native`** en toda la app. Tamaños: 14–16 dentro de
  chips/metadatos · 18 en botones circulares `h-10` · 22–26 en acciones grandes.
- Color siempre desde la tabla de iconos de §2 (según esquema), o el `tint` de
  la categoría cuando el icono representa una categoría.
- Tab bar: PNGs de `assets/images/tabIcons` con `tintColor` (activo/inactivo).
- Botones de solo-icono llevan `accessibilityLabel` **siempre**.

---

## 10. Voz y copy

- **Español, tuteo, corto.** Labels de 1–2 palabras ("Hoy", "Categoría",
  "Cambiar"). Preguntas directas como placeholder ("¿En qué fue?").
- Fechas relativas primero: "Hoy" / "Ayer" / "12 mar" (+año solo si difiere).
- Errores = imperativo + qué falta: "Ingresa una razón", "Elige una categoría",
  "Monto inválido". Sin culpas ni exclamaciones.
- **Copy honesto:** cero métricas inventadas, cero datos placeholder que
  parezcan reales. Si no hay dato, estado vacío explícito.
- Sentence case en todo; nada de MAYÚSCULAS como estilo.

---

## 11. Accesibilidad

- `accessibilityLabel` en todo control sin texto visible (ya es convención).
- Contraste mínimo 4.5:1 en texto de cuerpo, 3:1 en texto grande y bordes de
  controles — vigilar especialmente `text-secundary` (`neutral-400`, ~2.3:1 en
  light) y `neutral-600` sobre `neutral-950` (usarlos solo en texto no esencial),
  y el texto blanco de botón sobre `bg-accent` (usar peso `bold`/tamaño grande).
  Para texto secundario esencial en light, preferir `text-neutral-500`.
- No bloquear `allowFontScaling`; las cifras protagonistas ya escalan por
  longitud y aceptan truncado con `numberOfLines={1}`.
- Rojo/verde nunca como único canal (§2 — icono o signo siempre).
- Motion espacial nueva respeta `useReducedMotion()` (§5).

---

## 12. Checklist pre-ship (slop test móvil)

Antes de dar por terminada una pantalla, todas las respuestas deben ser **sí**:

1. ¿Todos los colores salen de tokens/`Colors.ts`/tints de dato (cero hex ad-hoc)?
2. ¿Se ve correcta en light **y** dark (parejas de §2)?
3. ¿Un solo accent primario en la pantalla?
4. ¿Targets ≥44pt (o `hitSlop`) y safe areas vía `Screen`?
5. ¿Radios con `rounded-*` de Tailwind, **sin** `borderCurve`?
6. ¿Cifras con `tabular-nums` y tamaño por longitud?
7. ¿Todos los estados: pressed, disabled, loading, error, success?
8. ¿Háptica según la escalera de §6 (y solo ahí)?
9. ¿Animaciones solo transform/opacity, con duraciones de §5?
10. ¿`accessibilityLabel` en iconos solos?
11. ¿Copy en español, corto, sin datos inventados?
12. ¿Reusa `Screen`/`Text`/`SheetModal`/Chip en vez de reinventarlos?
13. ¿Sin sombras nuevas fuera de las tres permitidas (§4)?
14. ¿Headers sin itálica y sin eyebrows numerados?
15. ¿El éxito es silencioso (háptica + navegación), no un toast?

---

## 13. Deudas conocidas (pre-flight)

Inconsistencias detectadas al escribir este documento; al tocar código cercano,
migrar hacia la regla:

1. **`src/constants/Colors.ts` sigue con superficies dark-only heredadas**
   (`surface #0A0A0A`, `surfaceCard`, …) que ya nadie necesita como sistema. Sus
   tokens de marca (`accent`, `up`/`down`, `accentLight`) ya están en emerald y
   espejan `@theme`. Pendiente: reducirlo a los tokens de dato vigentes
   (`up`/`down`, alphas, gradientes) y borrar las superficies muertas.
2. **Colores de icono repetidos inline** (`scheme === 'dark' ? '#a3a3a3' : '#737373'`
   en varias pantallas, ya alineados a la rampa neutral). Pendiente: helper único
   (p. ej. `useIconColors()`) que exponga `primary/muted/faint` según esquema.
3. **Accent como texto en dark sin token propio:** hoy se escribe
   `dark:text-emerald-400` inline. Es correcto (paleta Tailwind), pero si se
   repite mucho vale promoverlo a un helper/clase semántica.
