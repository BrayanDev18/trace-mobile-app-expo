/**
 * Reglas de captura de montos con keypad: hasta 7 enteros, 2 decimales
 * y un solo punto. Devuelve el mismo string si la tecla no aplica.
 */
export const appendAmountKey = (current: string, key: string): string => {
  if (key === '.') {
    if (current.includes('.')) return current;
    return current === '' ? '0.' : `${current}.`;
  }
  if (current === '0') return key;

  const [int, dec] = current.split('.');
  if (dec !== undefined && dec.length >= 2) return current;
  if (dec === undefined && int.length >= 7) return current;
  return current + key;
};

export const displayAmount = (raw: string): string => {
  if (!raw) return '0';
  const [int, dec] = raw.split('.');
  const grouped = Number(int || '0').toLocaleString('en-US');
  return dec === undefined ? grouped : `${grouped}.${dec}`;
};