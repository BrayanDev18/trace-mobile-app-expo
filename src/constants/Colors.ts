/**
 * Color tokens for JS-side usage: icon `color` props, chart configs, and
 * LinearGradient `colors`, where NativeWind classNames don't apply.
 *
 * These mirror the `@theme` tokens in `src/global.css` — keep both in sync.
 * For className styling prefer the Tailwind tokens (e.g. `bg-accent`).
 */
export const Colors = {
  // Trend / status (emerald-400 up, red-400 down) — used across charts, arrows, pills
  up: '#34d399',
  down: '#f87171',

  // Brand accent (mirrors Tailwind `accent` = emerald)
  accent: '#059669',
  accentDim: '#047857',
  accentLight: '#34d399',

  // Surfaces (mirror Tailwind `surface`)
  surface: '#0A0A0A',
  surfaceElevated: '#111111',
  surfaceLight: '#161616',
  surfaceCard: '#1C1C1C',
  surfaceBorder: '#2A2A2A',
  muted: '#737373',

  white: '#ffffff',
} as const;

/** Translucent fills derived from the trend colors (chart areas, badges). */
export const trendAlpha = {
  up: (alpha: number) => `rgba(52, 211, 153, ${alpha})`,
  down: (alpha: number) => `rgba(248, 113, 113, ${alpha})`,
} as const;

/** Gradient color pairs for `LinearGradient`. */
export const Gradients = {
  accent: ['#34d399', '#059669'] as const,
  disabled: ['#262626', '#262626'] as const,
} as const;
