import i18next from '@/i18n';

type DateDataProps = {
  monthsShort: string[];
  monthsLong: string[];
  weekdaysShort: string[];
  weekdaysLong: string[];
};

const DATA: Record<'es' | 'en', DateDataProps> = {
  es: {
    monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    monthsLong: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ],
    weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    weekdaysLong: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  },
  en: {
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthsLong: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};

const lang = (): 'es' | 'en' => (i18next.language?.startsWith('en') ? 'en' : 'es');

export const monthsShort = () => DATA[lang()].monthsShort;
export const monthsLong = () => DATA[lang()].monthsLong;
export const weekdaysShort = () => DATA[lang()].weekdaysShort;
export const weekdaysLong = () => DATA[lang()].weekdaysLong;

export const dateNames = (language: 'es' | 'en') => DATA[language];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const sameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

export const shortDate = (d: Date) =>
  i18next.t('common:date.short', {day: d.getDate(), month: monthsShort()[d.getMonth()]});

export const longDate = (d: Date) =>
  i18next.t('common:date.long', {day: d.getDate(), month: monthsLong()[d.getMonth()], year: d.getFullYear()});

export const dayMonthLabel = (d: Date) =>
  i18next.t('common:date.dayMonth', {day: d.getDate(), month: monthsLong()[d.getMonth()]});

export const relativeDate = (d: Date) => {
  const now = new Date();
  if (sameDay(d, now)) return i18next.t('common:date.today');
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return i18next.t('common:date.yesterday');
  const year = d.getFullYear() === now.getFullYear() ? '' : ` ${d.getFullYear()}`;
  return `${shortDate(d)}${year}`;
};

export const timeLabel = (d: Date) => {
  const hours = d.getHours() % 12 || 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const period = i18next.t(d.getHours() < 12 ? 'common:date.am' : 'common:date.pm');
  return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
};