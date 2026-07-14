# Trace · Auditoría de código

**Fecha:** 2026-07-14 · **Commit auditado:** `41b4e62` (rama `cc-brayan-dev18`)
**Alcance:** todo `src/` (74 archivos, 5.385 líneas) + dependencias + estructura.
**Método:** 5 revisiones paralelas por área (formularios, detalles, listas/layouts,
componentes compartidos, features/stores/estructura) + typecheck + knip + verificación
por grep de cada afirmación de código muerto.

**Criterios de la auditoría** (en orden de prioridad):

1. Screens > 120 líneas → componentizar.
2. Cero código repetido → priorizar reutilización.
3. Eliminación de código, imports, props y dependencias muertas.
4. Subcomponentes en el mismo archivo van **debajo** del componente principal.
5. Best practices React Native/Expo: optimización, fluidez, native feel.
6. Cumplimiento de `design.md` (sistema bloqueado) y convenciones del repo.

---

> **Estado: EJECUTADA (2026-07-14).** Las 8 fases de §9 se aplicaron en un único
> commit. Verificación final: `tsc` limpio · ESLint 0 problemas (antes 2 errores
> + 73 warnings) · `expo export` sin errores ni require cycles · todas las
> screens ≤120 líneas (máx. 117) · 0 violaciones de subcomponente-abajo ·
> `src/screens` migrado a `src/features/<x>/` con stores/tipos dentro.
> Total `src`: 5.385 → 5.335 líneas con ~25 componentes/hooks/utils reutilizables
> nuevos — el mismo producto, sin duplicación.
> Decisiones divergentes documentadas: `PrimaryButton` (pill) conserva el texto
> default por contraste sobre `accent/60` en light (las CTAs anchas de panel sí
> llevan `text-white`); los dots del onboarding actualizan durante el gesto vía
> `onScroll` pero no animan `width` (prohibido por design.md §5); los hex del
> hero de onboarding quedan como color-de-ilustración (regla 4 de §2);
> `getPaymentMethod` mantiene retorno `undefined` (método es opcional, semántica
> distinta a `getCategory`).

## 0. Resumen ejecutivo

El proyecto está sano de base: **typecheck limpio**, ningún componente compartido
muerto, Skia y Reanimated bien usados, y decisiones buenas ya tomadas (FlashList,
input no controlado, `useAnimationClock` con cap de fps). El problema dominante es
**duplicación**: las 4 pantallas de creación comparten ~60% del código, las 4 de
detalle repiten keypad/filas/acciones, y los 3 banners de overview son el mismo
componente escrito tres veces.

| Métrica | Hoy | Tras aplicar el plan |
| --- | --- | --- |
| Screens > 120 líneas | **9** (máx. 454) | 0 |
| Violaciones "subcomponente abajo" | **12 archivos** | 0 |
| Archivos 100% muertos | 2 (`theme.ts`, `mock.ts`) | 0 |
| Dependencias muertas | 4 | 0 |
| Directorios vacíos | 15 | 0 |
| Bugs funcionales | 2 (1 crítico) | 0 |
| Líneas en pantallas new/* | 1.310 | ~370 + kit reutilizable |

---

## 1. Bugs funcionales (arreglar primero)

| Sev | Ubicación | Problema | Solución |
| --- | --- | --- | --- |
| 🔴 Crítica | `src/app/(protected)/subscriptions/[id].tsx:27` | `?? subscriptions[0]`: con un id inválido la pantalla muestra **otra** suscripción, y "Eliminar" borraría la equivocada | Quitar el fallback; `if (!subscription) return <Redirect …/>` |
| 🟠 Alta | `src/app/(protected)/expenses/[id].tsx:66-68` | `rightIcon={IconPencil}` renderiza un lápiz **sin acción**: botón de editar muerto | Quitar el icono o implementar la edición |
| 🟠 Alta | `src/app/(protected)/(tabs)/home/index.tsx:16-21` | Balance e income/expense **hardcodeados** (280000, 780000…) que parecen datos reales — viola design.md §10 "copy honesto" | Derivar de `useMovementsStore` o estado vacío explícito |
| 🟠 Alta | `src/app/(protected)/goals/new.tsx:240` | CTA sin `text-white`: texto `text-primary` sobre `btn-primary` (accent/60 en light) — contraste insuficiente | Añadir `text-white` (se resuelve de raíz en `CapturePanel`, §4.1) |
| 🟠 Alta | `src/app/(protected)/subscriptions/[id].tsx:75` | Icono fallback con `color="#171717"` fijo: **invisible en dark** | Color desde `useIconColors()` (§4.2) |
| 🟡 Media | los 4 stores persistidos (`src/store/*.ts`) | Rehidratación async sin gate: en cold start las pantallas pintan un frame de "sin datos" antes de hidratar | Exponer `hasHydrated` vía `onRehydrateStorage` y gatear en la raíz |
| 🟡 Media | `src/app/(public)/onboarding/index.tsx:51,81` | `edges={["bottom"]}` + `paddingBottom: insets.bottom` → inset inferior **doble** | Quitar uno de los dos |

---

## 2. Screens > 120 líneas — planes de componentización

### 2.1 Formularios (1.310 líneas → ~370)

Las 4 pantallas de creación son en ~60% el mismo código. La extracción correcta no
es por pantalla sino un **kit de captura compartido** (`src/components/capture/` +
hooks), y cada pantalla queda solo con su lógica propia:

| Screen | Hoy | Extracciones propias | Final est. |
| --- | --- | --- | --- |
| `expenses/new.tsx` | 454 | `useExpenseForm.ts` (RHF+zod+shake), `ReceiptControl.tsx` | ~110 |
| `subscriptions/new.tsx` | 389 | `BrandSearch.tsx` (búsqueda+estados), `BrandSummary.tsx` | ~100 |
| `goals/new.tsx` | 246 | ninguna — solo kit compartido | ~85 |
| `debts/new.tsx` | 221 | ninguna — solo kit compartido | ~75 |

**Kit de captura** (elimina el 60% duplicado):

- **`useAmountInput({value, onChange})`** (`src/hooks`) — keypad handlers
  (`onKey/erase/clear` con háptica), `display`, `sizeClass`, pop `withSequence`.
  Hoy copiado en `expenses/new:98-123`, `subscriptions/new:77-100`,
  `goals/new:56-79`, `debts/new:57-80` **y** en los detalles de debts/goals.
- **`<AmountDisplay>`** — `$` + cifra animada + error/acento/sufijo
  (props object: `{display, sizeClass, animatedStyle, error?, suffix?}`).
- **`<CapturePanel>`** — panel inferior anclado: `rounded-t-[28px] bg-secundary`
  + sombra whisper + `PANEL_HEIGHT` + crossfade `FadeIn(150)/FadeOut(120)` + CTA
  `h-14 btn-primary text-white`. El wrapper `Animated.View entering/exiting` está
  copiado **11 veces** entre los 4 archivos; `PANEL_HEIGHT=330`, el type `Panel` y
  `togglePanel`, 4 veces.
- **`<FormSheetHeader {title?, onClose, right?}>`** — unifica las 3 recetas
  divergentes de botón cerrar (`h-10 bg-neutral-200` vs `h-12 bg-tertiary`).
- **`<PillPicker {options, selectedId, onSelect}>`** — pills de selección
  (categorías, métodos, temas); fija de una vez el trío tint `1f/66/pleno`.
- **`<SegmentChips>`** — opción binaria (`PERIODS` de subscriptions:255-280,
  `DIRECTIONS` de debts:148-163, hoy copiados).
- **Panel de fecha preconfigurado** — chip calendario + `MonthCalendar` +
  `select()` + volver al keypad: receta idéntica 4 veces.

**Decisiones únicas al unificar** (hoy hay 3 recetas para lo mismo):

- Chip activo: `btn-primary` (canónico) — hoy convive con `bg-accent!` (goals:150,
  debts:158) y `bg-accent` (expenses:416).
- Alpha de tint activo: `${tint}1f` (design.md §2) — hoy convive `'10'`
  (expenses:274,368), `'1f'` (goals:220) y `'22'` (ExpenseRow).
- Validación: patrón de expenses (lazy `attempted` + shake + háptica Error, §7)
  es el canónico; subscriptions/goals/debts solo deshabilitan la CTA.

### 2.2 Detalles (920 líneas → ~420)

| Screen | Hoy | Camino | Final est. |
| --- | --- | --- | --- |
| `debts/[id].tsx` | 297 | kit detalle + `useAmountInput` | ~110–125 |
| `goals/[id].tsx` | 293 | kit detalle + `useAmountInput` | ~105–120 |
| `expenses/[id].tsx` | 169 | kit + `ReceiptRow`/`ReceiptSheet` propios | ~90–100 |
| `subscriptions/[id].tsx` | 161 | kit + `SubscriptionHeroCard` propio | ~80–90 |

**Kit de detalle:**

- **`Row` → promover a `src/components/Group.tsx`** (`{label, children, medium?}`):
  copiado idéntico en las 4 pantallas y siempre **arriba** del principal (doble
  violación). Cuarta copia = promoción obligatoria (design.md §8).
- **`<AmountEntryPanel>`** — panel keypad+display+confirmar de abonos/aportes:
  ~70 líneas duplicadas casi línea a línea entre `debts/[id]:59-94,166-224` y
  `goals/[id]:62-97,161-213`. Compone `useAmountInput` + `Keypad` + `AmountDisplay`.
- **`<HistoryList {items, emptyLabel, hint, onRemoveConfirm}>`** — lista de
  abonos (debts:247-279) = lista de aportes (goals:242-275), incluida fila
  long-press + separador + hint.
- **`<DetailHero {badge, title, amount, meta?}>`** — hero centrado duplicado en
  debts/goals/expenses.
- **`<GroupAction {label, caption, destructive?, onPress}>`** — bloque final
  Group+Pressable+caption copiado en las **4** pantallas.
- `goals/[id]:49-54`: derivaciones `saved/progress/percent/remaining/monthly`
  inline → consolidar en `goalMath.ts` (`goalProgress(goal, contributions)`).

### 2.3 Listas y onboarding

- **`debts/index.tsx` (120–121)** → con `EmptyState` + `SectionTitle` + `ListGap`
  compartidos queda en ~75 líneas.
- **`onboarding/index.tsx` (133)** → crear `src/screens/onboarding/`: `slides.ts`,
  `OnboardingHero.tsx`, `PageDots.tsx`, `SlideCarousel.tsx`. Screen final ~45.
- **`BalanceCardSkia.tsx` (281, componente)** → dividir: `balanceShader.ts`
  (shader + `hex01` + `BALANCE_PALETTES`), `OverviewPopover.tsx`, `Stat` debajo
  del principal. Queda ~120. Bonus: el shader deja de compilarse al importar el
  barrel `screens/home` y el `!` de `RuntimeEffect.Make` deja de poder crashear
  en import.
- **`HorizontalCalendar.tsx` (127, componente)** → extraer `DayCell` con
  `React.memo` (debajo del principal): baja de 120 **y** arregla el re-render de
  todas las celdas en cada selección (§5).

---

## 3. Código muerto (verificado con grep/knip)

### Archivos completos

| Archivo | Evidencia | Acción |
| --- | --- | --- |
| `src/constants/theme.ts` (65 líneas) | 0 consumidores; exporta un segundo `Colors` que colisiona con `constants/Colors.ts` | **Borrar** |
| `src/screens/subscriptions/mock.ts` (65 líneas) | 0 usos de `MOCK_SUBSCRIPTIONS`/`getSubscription`, pero el barrel lo exporta → 5 iconos de marca entran al bundle (Metro no tree-shakea `export *`) | **Borrar** + quitar del barrel |

### Directorios vacíos (15)

`src/features/*` (6), `src/services`, `src/types`,
`src/app/(protected)/{transaction,settings,accounts,budgets,notifications,reports}`,
`src/app/(protected)/(tabs)/{insights,transactions}`.
Git no los versiona: son ruido local que sugiere una arquitectura que no existe.
**Borrar**; se recrean cuando exista código real (lo planificado ya está documentado
en `ScreenRoutes`).

### Exports, props y variables muertas

| Ubicación | Muerto |
| --- | --- |
| `src/constants/Colors.ts:14-39` | Todo salvo `up`/`down`: `accent`, `accentDim`, `accentLight`, `surface*` ×5, `muted`, `white`, `trendAlpha`, `Gradients` (design.md §13.1 ya lo pedía) |
| `src/screens/goals/GoalsOverview.tsx:9-20` | Prop `segments` + tipo `GoalSegment`: se pasan desde `goals/index.tsx:40-44` pero **nunca se leen** — borrar cálculo, prop y tipo |
| `src/components/Screen.tsx:15,17,20,24` | Props `keyboardOffset`, `padded`, `contentClassName` y `DEFAULT_PADDING`: 0 consumidores |
| `src/components/Input.tsx:16` | Prop `containerClassName`: 0 usos |
| `src/components/HorizontalCalendar.tsx:34,74` | `listRef` se crea y asigna pero nunca se invoca |
| `src/screens/home/BalanceCardSkia.tsx:55-98` | `export` innecesarios: `BALANCE_PALETTES`, `PaletteName`, `balanceSize`, `Overview`, `OverviewPopover`, `Stat` — 0 consumidores externos |
| `src/app/(protected)/subscriptions/new.tsx:210` | Clase muerta `font` en `"font-satoshi-bold text-xl font"` |
| `src/app/(protected)/expenses/new.tsx:365-366` | `bg-neutral-100 dark:bg-neutral-800` + `bg-secundary` condicional: tailwind-merge deja una rama muerta |

### Dependencias

| Paquete | Estado | Acción |
| --- | --- | --- |
| `@expo/ui`, `expo-blur`, `expo-web-browser` | 0 imports en `src/` y `app.json` | `bun remove` |
| `prettier-plugin-tailwindcss` | No hay config de Prettier en el repo (ni Prettier instalado) | `bun remove` |
| `babel-preset-expo` | **Conservar**: Expo lo usa implícitamente aunque no exista `babel.config.js` | — |

> ⚠️ Tras cualquier `bun remove`/`bun install`, correr `bunx install-skia` antes de
> `pod install` (los binarios prebuilt de Skia se pierden en el postinstall de bun).

---

## 4. Duplicación cruzada — catálogo de abstracciones

Consolidado de los 5 informes, sin solapamientos. Regla design.md §8: al tercer
copia-pega, se promueve a componente.

### 4.1 Kit de captura y detalle

Ver §2.1 y §2.2 (`useAmountInput`, `AmountDisplay`, `CapturePanel`,
`FormSheetHeader`, `PillPicker`, `SegmentChips`, `AmountEntryPanel`,
`HistoryList`, `DetailHero`, `GroupAction`, `Row`).

### 4.2 Fundaciones transversales (habilitan todo lo demás)

| Abstracción | Elimina | Copias hoy |
| --- | --- | --- |
| **`src/utils/haptics.ts`** — `haptic.tap()/select()/success()/error()` con gate iOS interno | Bloque `isIOS + tap + select` | 6+ archivos (4 new/*, 2 detalles) |
| **`src/hooks/useIconColors.ts`** — `{primary, muted, faint}` por esquema | Ternarios `dark ? '#a3a3a3' : '#737373'`, `#171717`, `#525252`… (deuda declarada design.md §13.2) | **11 archivos** |
| **`utils/formatDate.ts` como fuente única** — exportar `MONTHS_LONG/SHORT`, `WEEKDAYS_SHORT`, `dayMonthLabel()`, `monthName()` | Arrays de meses re-implementados | **5 sitios**: HorizontalCalendar:8, MonthCalendar:5-14, expenses/index:10, subscriptions/new:24, formatDate:1-5. `subscriptions/new:24-25` además reimplementa `shortDate` que ya existe |
| **`amountSizeClass(display)` en `utils/amount.ts`** — regla ≤6→`text-6xl` · 7-9→`text-5xl` · >9→`text-4xl` (design.md §3) | Ternarios con **umbrales divergentes** | 6 sitios: 3 detalles, BalanceCardSkia:73, DebtsOverview:20, GoalsOverview:27 |

### 4.3 Kit de listas

| Abstracción | API | Elimina |
| --- | --- | --- |
| **`<EmptyState>`** | `{title, subtitle, actionLabel?, onAction?}` | debts/index:86-102 ≈ goals/index:70-86; da el empty **faltante** de subscriptions/index y arregla el copy roto de expenses ("Toca +" sin botón + visible) |
| **`<PrimaryButton>`** | `{icon?, label, onPress}` (pill `btn-primary` + `IconPlus` + color interno) | 5 copias pixel-a-pixel: debts/index:94-100, goals/index:78-84, DebtsOverview:48-54, GoalsOverview:55-61, SubscriptionsBanner:43-49 |
| **`<SectionTitle>`** | `{children}` | debts/index:105, goals/index:66, subscriptions/index:43 |
| **`<ListGap>`** (o wrapper `FeatureList` con FlashList + contentContainerStyle común + empty condicional) | — | 4 `Gap` locales idénticos (debts:16, expenses:15, goals:12, subscriptions:11) |
| **`<OverviewBanner>`** | `{title, figure, meta, ctaLabel, onAdd, prefix?}` | `DebtsOverview` + `GoalsOverview` + `SubscriptionsBanner`: misma estructura completa (~175 líneas → ~70). Bonus: elimina la divergencia accidental `rgba(24,27,38,…)` vs `rgba(24,27,32,…)` y unifica la API (`GoalsOverview` hardcodea `router.push`; los otros reciben `onAdd`) |
| **`<TintedTile {tint, icon\|initial}>`** | — | Tile `h-12/14 rounded-xl` con fondo `${tint}1f` repetido en DebtCard, GoalCard, SubscriptionCard, TransactionRow y detalles |

### 4.4 Estado y utils

| Abstracción | Elimina |
| --- | --- |
| **`createPersistedListStore<T>(storageKey)`** | `movements.ts` y `subscriptions.ts` estructuralmente idénticos (items/add/remove + persist + partialize) |
| **`sumByKey(items, fk, id)`** | `debtPaid` (debts.ts:67) ≡ `goalSaved` (goals.ts:66) |
| **`debtTint(direction)`** junto al feature | `isLent ? Colors.up : Colors.down` en DebtCard:16 y debts/[id]:48 |
| **`confirmDestructive({title, message, actionLabel, onConfirm})`** (opcional, prioridad baja) | 4 `Alert.alert` con la misma estructura y háptica inconsistente (debts/[id]: `confirmSettle` con háptica, `confirmRemove` sin) |

---

## 5. Regla "subcomponentes abajo" — violaciones (12 archivos)

| Archivo | Subcomponente(s) arriba | Destino |
| --- | --- | --- |
| `src/components/Input.tsx:19-42` | `BaseInput` | Debajo de `Input` |
| `src/screens/home/BalanceCardSkia.tsx:98,149` | `OverviewPopover`, `Stat` | `OverviewPopover.tsx` propio; `Stat` debajo |
| `src/screens/home/TransactionsList.tsx:11` | `TransactionRow` | Debajo (o archivo propio + `memo`) |
| `src/app/(protected)/expenses/index.tsx:15,17-40` | `Gap`, `ExpenseRow` | `ExpenseRow` → `src/screens/expenses/ExpenseRow.tsx`; `Gap` → `ListGap` |
| `src/app/(protected)/debts/index.tsx:16` | `Gap` | `ListGap` compartido |
| `src/app/(protected)/goals/index.tsx:12` | `Gap` | `ListGap` compartido |
| `src/app/(protected)/subscriptions/index.tsx:11` | `Gap` | `ListGap` compartido |
| `debts/[id].tsx:20-25` · `goals/[id].tsx:20-25` · `expenses/[id].tsx:15-20` · `subscriptions/[id].tsx:15-20` | `Row` ×4 | Promover a `Group.tsx` (§4.1) |

Con `const` arrow functions la referencia se evalúa en render, no al cargar el
módulo, así que mover los subcomponentes abajo es seguro. Las 4 pantallas `new/*`
no definen subcomponentes: sin violaciones ahí.

---

## 6. Performance, fluidez y native feel

| Sev | Ubicación | Problema | Solución |
| --- | --- | --- | --- |
| 🟠 | `expenses/new.tsx:89-92` | `useWatch` de 6 campos en la raíz → **cada tecla del keypad re-renderiza la pantalla completa** | `AmountDisplay` observa solo `amount` con su propio `useWatch(control)` |
| 🟠 | `DebtCard`, `GoalCard`, `SubscriptionCard` | Filas de FlashList **sin `React.memo`** → re-render de todas las filas ante cualquier cambio del padre | Envolver los tres en `memo()` |
| 🟠 | `HorizontalCalendar.tsx:90-123` | `renderItem` inline con closure sobre `selected` → todas las celdas re-renderizan en cada selección | `DayCell` con `memo` (§2.3) |
| 🟡 | `debts/index:103-113`, `expenses/index:89`, `goals/index:87-93` | `renderItem`/`keyExtractor`/`getItemType` como arrows inline se recrean por render | Estabilizar (nivel módulo o `useCallback`) |
| 🟡 | `onboarding/index.tsx:83-103` | Dots solo actualizan en `onMomentumScrollEnd` (saltan al soltar) y el cambio w-2→w-5 no anima | `useAnimatedScrollHandler` + dots interpolados; respetar `useReducedMotion` (§5 design.md) |
| 🟡 | los 4 stores | Sin gate de hidratación (ver §1) | `hasHydrated` |
| ✅ | — | Ya correcto: FlashList en listas, `expo-image` en TabBar, `Intl.NumberFormat` memoizado, Keypad con `onPressIn`, shader Skia en una pasada sin trabajo por frame, input no controlado | — |

**Accesibilidad / HIG:**

- `TabBar.tsx:47-58,71-77` — tabs y FAB solo-icono **sin `accessibilityLabel`**,
  sin `accessibilityRole="tab"` ni `accessibilityState` (design.md §9 lo exige).
- `expenses/new.tsx:173` — botón X sin `accessibilityLabel` (las otras 3 sí).
- `Header.tsx:40-47` — `rightIcon` sin label acompañante → prop `rightLabel`.
- `TabBar.tsx:73` — FAB `w-16 h-16` sin `-mt-8` vs design.md §8 que la define
  `h-14 w-14 -mt-8`: alinear código o corregir el doc (drift).

---

## 7. Consistencia con design.md y copy

| Ubicación | Problema | Solución |
| --- | --- | --- |
| `HomeHeader.tsx:11,24-28` | "Good Morning" / "Welcome back" en inglés + default `name='Brayan'` quemado | Copy en español; nombre desde sesión |
| `QuickActions.tsx:14-16,28` | Labels en inglés + typo "Suscriptions"; color `#a1a1a1` fuera de rampa | "Suscripciones/Metas/Deudas"; `useIconColors()` |
| `subscriptions/new.tsx:146` | "Nueva suscripcion" sin tilde | "Nueva suscripción" |
| `expenses/index.tsx:73` | Total en `text-red-500`; §2 fija gasto = `red-400` | `text-red-400` |
| `subscriptions/[id].tsx:100,103` | `text-neutral-600 dark:text-white/80` ad-hoc | `text-secundary` |
| `HorizontalCalendar:100,107,114` | `font-semibold` (Satoshi no tiene 600) y `bg-black dark:bg-white` sueltos | `font-satoshi-medium`; pareja de rampa neutral |
| `MonthCalendar:39-51` | Accent `#009689` hardcodeado 3× (en dark debería ser teal-800/teal-400) | Derivar del esquema vía `Colors.ts` |
| `expenses/new.tsx:213,229` | `text-red-400 dark:text-red-400` redundante | Solo `text-red-400` |
| `expenses/index.tsx:57` | Única lista sin `Header` (sin affordance de volver) | `Header title="Gastos"` |
| `expenses/[id].tsx:64` | `edges={['top']}` vs default en los otros detalles | Unificar criterio |
| `onboarding/index.tsx:9-11,2` | Imports directos esquivando el barrel `@/components`; comillas dobles | Unificar |
| `onboarding/index.tsx:118-126` | "Comenzar" sin háptica Success (§6) | `haptic.success()` |
| `(tabs)/stats\|explore\|profile/index.tsx` | 3 archivos byte-idénticos salvo título | `<ComingSoon title>` — cada screen queda en 3 líneas |
| `ScreenRoutes.ts:24-26` | `stats` marcado 🚧 pero existe; `explore` no registrado | Actualizar registro |
| `Dottedglowbackground.tsx` | Filename fuera de PascalCase | `git mv` en 2 pasos (FS case-insensitive) → `DottedGlowBackground.tsx` |
| `subscriptions/new.tsx:114` | `category: brand.domain` — un dominio guardado en un campo llamado categoría | Renombrar campo a `domain` |
| `expenses/new.tsx:40,89` | Campo `method` guarda un id (`methodId` en el store) | Renombrar a `methodId` |
| `subscriptions/new.tsx:177` | `key={`${domain}-${index}`}` con índice en lista que cambia por keystroke | `key={result.domain}` |
| `paymentMethods.tsx:82` | `getPaymentMethod` devuelve `undefined`; `getCategory`/`getGoalTheme` devuelven fallback | Unificar criterio |
| `TypeSwitch.tsx:55-56` | Dos ramas condicionales idénticas | `active && 'font-satoshi-bold'` |
| `debts/[id].tsx:45` | `if (!debt) return null` → pantalla en blanco con id inválido | `Redirect` |

---

## 8. Estructura del proyecto

Hoy conviven **tres convenciones**: `src/app` (rutas con lógica pesada dentro),
`src/screens/<feature>` (componentes de feature, en uso) y `src/features/*`
(100% vacío), más una **dependencia invertida**: la capa de estado importa tipos
desde la UI (`store/movements.ts:5` ← `@/screens/expenses`;
`store/subscriptions.ts:5` ← `@/screens/subscriptions`).

**Recomendación — una sola convención (la que pide AGENTS.md):**

1. **Hoy:** borrar los 15 directorios vacíos.
2. **Objetivo:** consolidar en `src/features/<feature>/` con el feature completo
   dentro — `components/`, `store.ts`, `types.ts`, `hooks/` (useBrandSearch),
   `utils.ts` (goalMath). `src/app/*` queda como capa de rutas delgada;
   `src/components|utils|constants|hooks` solo para transversales.
3. Esto corrige la dependencia invertida (los tipos viven en
   `features/<x>/types.ts`, y tanto store como UI los importan de ahí).
4. Migración mecánica en una pasada (`git mv` + actualizar imports); hacerla
   **después** de las fases de deduplicación para no mover código que va a morir.

Otros puntos de estructura:

- Barrels `screens/*/index.ts` inconsistentes (1 línea vs 4; comillas mixtas).
- `screens/goals/index.ts` exporta `ProgressBar` (genérico) desde un feature →
  evaluar promoverlo a `src/components`.
- `Screen.tsx:43-45` — colores del glow hardcodeados en JS → tokens de
  ilustración en `Colors.ts`.
- design.md §3 dice que las fuentes se cargan "en `_layout.tsx` con `useFonts`" —
  ya migraron al plugin de `expo-font` en `app.json` → **actualizar design.md**.

---

## 9. Plan de ejecución priorizado

Cada fase deja el repo compilando; todas se integran en **un único commit** al
final de la ejecución. Las fases 3-6 se implementan bajo las convenciones de
§10 (hooks) y §11 (barrels).

| Fase | Contenido | Riesgo | Impacto |
| --- | --- | --- | --- |
| **0 · Bugs** | §1 completo: fallback `subscriptions[0]`, lápiz muerto, datos fake del home, `text-white` en CTA, icono invisible en dark, doble inset del onboarding | Bajo | Corrige comportamiento visible |
| **1 · Limpieza muerta** | §3 completo: borrar `theme.ts` + `mock.ts`, podar `Colors.ts`, props muertas, 15 dirs vacíos, `bun remove` de 4 deps (+ `bunx install-skia`) | Bajo | −~200 líneas, bundle más chico |
| **2 · Fundaciones** | §4.2: `haptics.ts`, `useIconColors`, fechas únicas en `formatDate.ts`, `amountSizeClass` | Bajo | Desbloquea las fases 3-5 |
| **3 · Kit captura** | §2.1: `useAmountInput` + `capture/*`; migrar las 4 `new/*` y resolver las 3 recetas divergentes (chip activo, CTA, alpha, validación) | Medio | −~940 líneas en screens; fix del re-render por tecla |
| **4 · Kit detalle** | §2.2: `Row`→Group, `AmountEntryPanel`, `HistoryList`, `DetailHero`, `GroupAction`; migrar los 4 `[id]` | Medio | −~500 líneas; 4 screens bajo 120 |
| **5 · Kit listas + home** | §4.3: `EmptyState`, `PrimaryButton`, `SectionTitle`, `ListGap`, `OverviewBanner`, `ComingSoon`; dividir `BalanceCardSkia`; memo de cards; `DayCell`; copy español del home | Medio | Listas ~50-75 líneas; fluidez de listas |
| **6 · Estructura** | §8: migración a `src/features/*`, stores dentro del feature, factory de stores + `hasHydrated`, barrels homogéneos | Medio-alto (mecánico) | Arquitectura final coherente con AGENTS.md |
| **7 · Polish** | Onboarding animado (dots interpolados + `useReducedMotion`), accesibilidad TabBar/Header, `confirmDestructive`, actualizar design.md §3/§8 | Bajo | Native feel + a11y |

**Regla de verificación por fase:** `bunx tsc --noEmit` + arrancar la app y pasar
el checklist pre-ship de design.md §12 en las pantallas tocadas.

---

## 10. Convención: separación de lógica en hooks

Regla transversal para implementar las fases 3-6 (también registrada en
`AGENTS.md` como convención permanente del repo). La screen es capa de
presentación: **conectar hooks + navegación + componer componentes** — así es
como se llega naturalmente a las 120 líneas sin "esconder" código.

### Criterio de extracción (en orden)

1. **Lógica reutilizada en 2+ sitios → hook, sin discusión.** No es
   organización, es eliminación de código repetido.
2. **Concern completo con estado/efectos → hook aunque tenga un solo
   consumidor** (form + validación + submit + shake; animación; data fetching).
   La screen queda leyéndose como "qué se ve"; el hook contiene "cómo se
   comporta".
3. **Sin reactividad de React → util, nunca hook.** Funciones puras van a
   `utils` — más testeables y sin acoplarse al render.
4. **No extraer trivialidades**: un `useState` con su setter, un derivado de
   una línea, handlers de 2-3 líneas que solo hacen `router.push`. Si un hook
   devuelve más de ~6 valores, son dos concerns → dividir.

### Capas (consistente con la Fase 6)

| Capa | Ubicación | Regla |
| --- | --- | --- |
| Screens (`src/app/*`) | rutas | Conectar hooks + navegación + componer; ≤120 líneas |
| Hooks de feature | `features/<x>/hooks/` | Lógica del feature con estado/efectos; consumen stores |
| Hooks transversales | `src/hooks/` | Reutilizados entre features |
| Utils | `src/utils/` · `features/<x>/utils.ts` | Funciones puras, cero React |
| Stores zustand | `features/<x>/store.ts` | Solo estado global persistido; nunca importan UI |
| Componentes | `src/components/` · `features/<x>/components/` | Presentacionales: props in, callbacks out, no importan stores |

### Mapa de las propuestas de esta auditoría según el criterio

| Propuesta | Capa | Por qué |
| --- | --- | --- |
| `useAmountInput` | hook transversal | Regla 1: 6 consumidores (4 new/* + 2 detalles); estado + shared values |
| `useIconColors` | hook transversal | Regla 1: 11 consumidores; lee `useColorScheme` (reactivo) |
| `useExpenseForm`, `usePanelToggle` | hook de feature / interno del kit | Regla 2: concern completo, un consumidor |
| `useBrandSearch` (ya existe) | hook de feature | Regla 2 bien aplicada — patrón de referencia |
| `haptics.ts` | util | Regla 3: sin estado ni contexto — no es hook |
| `goalMath`, `amountSizeClass`, `formatDate`, `sumByKey`, `debtTint` | utils | Regla 3: funciones puras |
| Derivados tipo `dayLabel`, handlers de navegación | quedan en la screen | Regla 4: extraerlos sería indirección |

Beneficio a futuro: cuando llegue el backend en Go, los hooks de feature cambian
por dentro (TanStack Query en vez de store local) sin tocar el JSX de las screens.

---

## 11. Convención: barrel files

Regla transversal para las fases 5-6 (también registrada en `AGENTS.md`).
Principio: el barrel es el **contrato de un módulo**, no un atajo de imports.
En RN el costo es real — Metro no hace tree-shaking de re-exports y los side
effects a nivel módulo se ejecutan al tocar el barrel — y esta auditoría
encontró ambos modos de fallo ya activos en el repo:

- `screens/subscriptions/index.ts` re-exporta `mock.ts` (muerto) → 5 iconos de
  marca entran al bundle aunque nadie los importe (§3).
- `screens/home/index.ts` re-exporta `BalanceCardSkia` → el shader de Skia se
  compila al importar cualquier cosa del barrel (§2.3).
- `MonthCalendar` ejecuta `LocaleConfig` como side effect al cargar
  `@/components`.
- `onboarding/index.tsx:9-11` esquiva el barrel `@/components` que usa el resto
  del repo (§7) — inconsistencia del caso contrario.

### Reglas

1. Barrel solo en **módulos transversales** (`src/components|utils|constants`)
   y como **API pública de cada feature** (`features/<x>/index.ts` exporta
   únicamente lo que consumen las rutas u otros features).
2. Solo **named exports**; nunca `export *` — hace visible qué expone el módulo
   y evita arrastrar muertos como `mock.ts`.
3. **Cero side effects a nivel módulo** en archivos barreleados: shaders,
   configs y datos pesados van a archivo propio importado directo por su único
   consumidor (`balanceShader.ts`, Fase 5).
4. Los archivos **internos** de un feature se importan entre sí directo, sin
   pasar por el barrel; sin barrels anidados (barrel que re-exporta barrels).
5. **Consistencia**: si un módulo tiene barrel, siempre se importa por el
   barrel (arreglar onboarding).

### Aplicación en este repo

| Barrel | Veredicto |
| --- | --- |
| `src/components/index.ts` | Mantener — transversal, todo se usa ampliamente; pasar a named exports homogéneos |
| `src/utils/index.ts` · `src/constants/index.ts` | Mantener — mismo caso |
| `screens/*/index.ts` → `features/<x>/index.ts` (Fase 6) | Adelgazar a API pública: quitar `mock.ts` (Fase 1), no re-exportar internos del feature |
| `screens/goals/index.ts` exportando `ProgressBar` | Promoverlo a `src/components` (ya flagueado en §8) — un genérico no sale por el barrel de un feature |
