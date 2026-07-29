import {useEffect} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {useTranslation} from 'react-i18next';

import i18next from '@/i18n';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useIconColors} from '@/hooks/useIconColors';
import {capitalize, dateNames} from '@/utils';

const CALENDAR_TODAY: Record<'es' | 'en', string> = {es: 'Hoy', en: 'Today'};

(['es', 'en'] as const).forEach((language) => {
  const names = dateNames(language);
  LocaleConfig.locales[language] = {
    monthNames: names.monthsLong.map(capitalize),
    monthNamesShort: names.monthsShort.map(capitalize),
    dayNames: names.weekdaysLong.map(capitalize),
    dayNamesShort: names.weekdaysShort.map(capitalize),
    today: CALENDAR_TODAY[language],
  };
});
LocaleConfig.defaultLocale = i18next.language === 'en' ? 'en' : 'es';

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

type MonthCalendarProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

export const MonthCalendar = ({selected, onSelect}: MonthCalendarProps) => {
  const {i18n} = useTranslation();
  const dark = useColorScheme() === 'dark';
  const {primary, muted} = useIconColors();
  const accentBg = dark ? '#005f5a' : '#009689';
  const accentText = dark ? '#00d5be' : '#009689';
  const key = toKey(selected);

  useEffect(() => {
    LocaleConfig.defaultLocale = i18n.language;
  }, [i18n.language]);

  return (
    <Calendar
      key={i18n.language}
      current={key}
      onDayPress={(day) => onSelect(fromKey(day.dateString))}
      markedDates={{[key]: {selected: true, selectedColor: accentBg}}}
      firstDay={1}
      enableSwipeMonths
      theme={{
        calendarBackground: 'transparent',
        textSectionTitleColor: muted,
        monthTextColor: primary,
        dayTextColor: primary,
        textDisabledColor: dark ? '#404040' : '#d4d4d4',
        todayTextColor: accentText,
        selectedDayBackgroundColor: accentBg,
        selectedDayTextColor: '#ffffff',
        arrowColor: primary,
        textMonthFontFamily: 'Satoshi-Bold',
        textDayHeaderFontFamily: 'Satoshi-Medium',
      }}
    />
  );
};