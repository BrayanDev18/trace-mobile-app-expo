import {useTranslation} from 'react-i18next';
import {IconCalendarEvent, IconCreditCard, IconTag, IconWallet} from '@tabler/icons-react-native';

import {PickerChip} from '@/components/capture';
import {relativeDate} from '@/utils';
import type {CategoryProps, PaymentMethodProps} from '@/constants';
import type {BudgetRowItemProps} from '@/features/budgets';

export type ExpensePanelProps = 'keypad' | 'date' | 'category' | 'method' | 'budget';

type ExpenseChipsProps = {
  panel: ExpensePanelProps;
  date: Date;
  category: CategoryProps | null;
  method?: PaymentMethodProps;
  budget?: BudgetRowItemProps | null;
  showBudget?: boolean;
  budgetWarning?: boolean;
  categoryError: boolean;
  onToggle: (panel: ExpensePanelProps) => void;
};

export const ExpenseChips = (props: ExpenseChipsProps) => {
  const {panel, date, category, method, budget, showBudget, budgetWarning, categoryError, onToggle} = props;
  const {t} = useTranslation();

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
        label={category ? t(category.labelKey) : t('expenses:chips.category')}
        tint={category?.tint}
        error={categoryError}
        active={panel === 'category'}
        onPress={() => onToggle('category')}
      />

      <PickerChip
        icon={method?.Icon ?? IconCreditCard}
        label={method ? t(method.labelKey) : t('expenses:chips.method')}
        active={panel === 'method'}
        onPress={() => onToggle('method')}
      />

      {showBudget ? (
        <PickerChip
          icon={budget?.theme.icon ?? IconWallet}
          label={budget ? budget.budget.name : t('expenses:chips.budget')}
          tint={budget?.theme.tint}
          error={budgetWarning}
          active={panel === 'budget'}
          onPress={() => onToggle('budget')}
        />
      ) : null}
    </>
  );
};
