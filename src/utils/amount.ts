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