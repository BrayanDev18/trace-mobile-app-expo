# Trace · Implementación de UI

Cómo se escribe la UI. Lo **visual** (tokens, tipografía, espaciado, motion,
háptica, componentes canónicos) vive en [design.md](design.md), que es el sistema
bloqueado y manda sobre este archivo en cualquier decisión de aspecto.

## Estilado

- **NativeWind `className` por defecto.** `style` / `StyleSheet` solo para lo que
  NativeWind no cubre: valores animados de Reanimated, `fontVariant`, color
  dinámico por dato, sombras puntuales.
- En componentes animados: `className` para lo estático, `style` únicamente para
  el valor animado.
- **Nunca clases de `textAlign` en un `TextInput`.** Con react-native-css 3.0.7
  (motor de NativeWind v5) `text-center` sobre `TextInput` crashea en runtime
  (`undefined is not a function` en `path.split` dentro de `nativeStyleMapping`).
  Evitar `textAlign` ahí, también vía `style`.

## Clases semánticas

`src/global.css` define seis utilidades que ya empaquetan su pareja light/dark y
se usan **sin** prefijo `dark:`: `bg-primary`, `bg-secundary`, `bg-tertiary`,
`text-primary`, `text-secundary`, `btn-primary`.

Son la fuente de verdad: no se recompone su valor a mano. Para texto secundario,
metadato o placeholder va `text-secundary`, nunca el par
`text-neutral-400 dark:text-neutral-600`. Duplicar los valores inline crea deriva
cuando cambian los tokens.

## Defaults de `<Text>`

`src/components/Text.tsx` ya aplica `font-satoshi text-base text-primary`.
Ninguno de los tres se repite en el `className` — solo se indica lo que difiere
(otro peso, otro tamaño, otro color).

Tampoco en ternarios: `cn` usa tailwind-merge y el default vive en el componente,
así que la rama "color normal" se omite y el default se restaura solo.

```tsx
<Text className={cn('font-satoshi-bold', isIncome && 'text-accent dark:text-teal-400')} />
```

`src/components/Input.tsx` es un `TextInput` de React Native y no hereda estos
defaults: ahí sí se declaran.

## Patrones nativos iOS

Trace debe sentirse como una app nativa de Apple, no como el look genérico de las
apps generadas con AI.

**Preferir:** listas agrupadas inset estilo Ajustes (label a la izquierda, valor
secundario a la derecha, separador hairline con inset izquierdo vía
`StyleSheet.hairlineWidth`) · `Alert.alert` nativo para confirmaciones
destructivas · la acción destructiva como fila roja centrada en su propio grupo,
con footer explicativo · botones de texto en la barra de navegación · press como
cambio de superficie en la fila.

**Evitar:** heros con squircle gigante centrado · todo envuelto en tarjetas
`rounded-3xl` con mucho padding · botones pill tintados para acciones destructivas
· entradas escalonadas animadas puramente decorativas · headers con botones
circulares grises.

## Tema

La preferencia (`system | light | dark`) se guarda en `src/store/theme.ts`
(persistida) y el esquema efectivo se resuelve en `src/hooks/useColorScheme.ts`,
reactivo a la preferencia y al OS.

**Regla:** todo componente que decida colores o gradientes en JS importa
`useColorScheme` desde `@/hooks/useColorScheme`, **nunca** de `react-native`. El
de react-native lee el esquema del OS y no sigue el toggle manual.

El porqué: en NativeWind v5 / react-native-css, `Appearance.setColorScheme()` no
emite el evento `change`, así que ni los `dark:` ni `useColorScheme()` se
re-renderizan solos. La reactividad la maneja un efecto en `src/app/_layout.tsx`
que llama `colorScheme.set()` de react-native-css (mueve los `dark:`) y
`Appearance.setColorScheme()` (consistencia nativa: Alerts, teclado). Aquí
`ColorSchemeName` es `'light' | 'dark' | 'unspecified'`, sin `null`: el reset a
sistema es `'unspecified'`.

Los colores de icono JS-side salen siempre de `useIconColors()`
(`src/hooks/useIconColors.ts`), nunca inline.
