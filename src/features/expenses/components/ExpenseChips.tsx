import {IconCalendarEvent, IconCreditCard, IconTag} from '@tabler/icons-react-native';

import {PickerChip} from '@/components/capture';
import {relativeDate} from '@/utils';
import type {CategoryProps, PaymentMethodProps} from '@/constants';

export type ExpensePanelProps = 'keypad' | 'date' | 'category' | 'method';

type ExpenseChipsProps = {
  panel: ExpensePanelProps;
  date: Date;
  category: CategoryProps | null;
  method?: PaymentMethodProps;
  categoryError: boolean;
  onToggle: (panel: ExpensePanelProps) => void;
};

export const ExpenseChips = (props: ExpenseChipsProps) => {
  const {panel, date, category, method, categoryError, onToggle} = props;

  return (
    <>
      <PickerChip
        icon={IconCalendarEvent}
        label={relativeDate(date)}
        active={panel === 'date'}
        onPress={() => onToggle('date')}
      />

      <PickerChip
        icon={category?.icon ?? IconTag}
        label={category?.label ?? 'Categoría'}
        tint={category?.tint}
        error={categoryError}
        active={panel === 'category'}
        onPress={() => onToggle('category')}
      />

      <PickerChip
        icon={method?.Icon ?? IconCreditCard}
        label={method?.label ?? 'Método'}
        active={panel === 'method'}
        onPress={() => onToggle('method')}
      />
    </>
  );
};
