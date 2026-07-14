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
} as const;
