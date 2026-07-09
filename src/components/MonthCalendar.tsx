import {useColorScheme} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
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
  const key = toKey(selected);

  return (
    <Calendar
      current={key}
      onDayPress={(day) => onSelect(fromKey(day.dateString))}
      markedDates={{[key]: {selected: true, selectedColor: '#059669'}}}
      firstDay={1}
      enableSwipeMonths
      style={{borderRadius: 16, paddingBottom: 8}}
      theme={{
        calendarBackground: 'transparent',
        textSectionTitleColor: dark ? '#a3a3a3' : '#737373',
        monthTextColor: dark ? '#ffffff' : '#000000',
        dayTextColor: dark ? '#ffffff' : '#000000',
        textDisabledColor: dark ? '#404040' : '#d4d4d4',
        todayTextColor: '#059669',
        selectedDayBackgroundColor: '#059669',
        selectedDayTextColor: '#ffffff',
        arrowColor: dark ? '#ffffff' : '#000000',
        textDayFontFamily: 'Satoshi-Regular',
        textMonthFontFamily: 'Satoshi-Bold',
        textDayHeaderFontFamily: 'Satoshi-Medium',
      }}
    />
  );
};
