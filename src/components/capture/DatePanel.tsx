import {MonthCalendar} from '@/components/MonthCalendar';
import {haptic} from '@/utils';

type DatePanelProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

export const DatePanel = ({selected, onSelect}: DatePanelProps) => (
  <MonthCalendar
    selected={selected}
    onSelect={(d) => {
      haptic.select();
      onSelect(d);
    }}
  />
);
