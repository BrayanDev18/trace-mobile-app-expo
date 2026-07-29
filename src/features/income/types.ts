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
