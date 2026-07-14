/**
 * Reglas de captura de montos con keypad: 2 decimales y un solo punto.
 * Devuelve el mismo string si la tecla no aplica.
 */
export const appendAmountKey = (current: string, key: string): string => {
  if (key === '.') {
    if (current.includes('.')) return current;
    return current === '' ? '0.' : `${current}.`;
  }
  if (current === '0') return key;

  const [, dec] = current.split('.');
  if (dec !== undefined && dec.length >= 2) return current;
  return current + key;
};

export const displayAmount = (raw: string): string => {
  if (!raw) return '0';
  const [int, dec] = raw.split('.');
  const grouped = Number(int || '0').toLocaleString('en-US');
  return dec === undefined ? grouped : `${grouped}.${dec}`;
};

/**
 * Escala tipográfica por dígitos (design.md §3): ≤6 → grande, 7-9 → media,
 * >9 → chica. `hero` para cifras protagonistas, `card` para banners/cards.
 */
export const amountSizeClass = (value: number, scale: 'hero' | 'card' = 'hero') => {
  const digits = Math.floor(Math.abs(value)).toString().length;
  const sizes =
    scale === 'hero'
      ? (['text-6xl', 'text-5xl', 'text-4xl'] as const)
      : (['text-5xl', 'text-4xl', 'text-3xl'] as const);

  if (digits <= 6) return sizes[0];
  if (digits <= 9) return sizes[1];
  return sizes[2];
};