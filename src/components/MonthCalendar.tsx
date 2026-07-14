import {useColorScheme} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import {useIconColors} from '@/hooks/useIconColors';
import {MONTHS_LONG, MONTHS_SHORT, WEEKDAYS_LONG, WEEKDAYS_SHORT, capitalize} from '@/utils';

LocaleConfig.locales['es'] = {
  monthNames: MONTHS_LONG.map(capitalize),
  monthNamesShort: MONTHS_SHORT.map(capitalize),
  dayNames: WEEKDAYS_LONG.map(capitalize),
  dayNamesShort: WEEKDAYS_SHORT.map(capitalize),
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

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
  const dark = useColorScheme() === 'dark';
  const {primary, muted} = useIconColors();
  const accentBg = dark ? '#005f5a' : '#009689';
  const accentText = dark ? '#00d5be' : '#009689';
  const key = toKey(selected);

  return (
    <Calendar
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
        textDayFontFamily: 'Satoshi-Regular',
        textMonthFontFamily: 'Satoshi-Bold',
        textDayHeaderFontFamily: 'Satoshi-Medium',
      }}
    />
  );
};