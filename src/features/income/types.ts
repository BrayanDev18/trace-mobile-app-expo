import type {DebtPaymentProps, DebtProps} from '@/features/debts';
import type {SavingContributionProps, SavingProps} from '@/features/savings';
import type {SubscriptionProps} from '@/features/subscriptions';

export type PayFrequencyProps = 'weekly' | 'biweekly' | 'monthly';

export type IncomeConfigProps = {
  amount: number | null;
  frequency: PayFrequencyProps;
  payday: number;
};

export type CycleRangeProps = {
  start: Date;
  end: Date;
};

export type CycleRecapProps = {
  cycle: CycleRangeProps;
  spent: number;
  registered: number;
  received: number | null;
  leftover: number | null;
};

export type CommitmentsProps = {
  cycle: CycleRangeProps;
  subscriptions: SubscriptionProps[];
  debts: DebtProps[];
  payments: DebtPaymentProps[];
  savings: SavingProps[];
  contributions: SavingContributionProps[];
};
