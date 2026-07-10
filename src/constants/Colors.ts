/**
 * Color tokens for JS-side usage: icon `color` props, chart configs, and
 * LinearGradient `colors`, where NativeWind classNames don't apply.
 *
 * These mirror the `@theme` tokens in `src/global.css` — keep both in sync.
 * For className styling prefer the Tailwind tokens (e.g. `bg-accent`).
 */
export const Colors = {
  // Trend / status (teal-400 up, red-400 down) — used across charts, arrows, pills
  up: '#00d5be',
  down: '#f87171',

  // Brand accent (mirrors Tailwind `accent` = teal)
  accent: '#009689',
  accentDim: '#00786f',
  accentLight: '#00d5be',

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
  up: (alpha: number) => `rgba(0, 213, 190, ${alpha})`,
  down: (alpha: number) => `rgba(248, 113, 113, ${alpha})`,
} as const;

/** Gradient color pairs for `LinearGradient`. */
export const Gradients = {
  accent: ['#00d5be', '#009689'] as const,
  disabled: ['#262626', '#262626'] as const,
} as const;
