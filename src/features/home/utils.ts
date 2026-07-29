import type {MovementProps} from '@/features/expenses';

export type PeriodProps = 'week' | 'biweekly' | 'month' | 'year';

export type OverviewProps = {
  period: PeriodProps;
  label: string;
  caption: string;
  income: number;
  expense: number;
  balance: number;
};

export const PERIODS: PeriodProps[] = ['week', 'biweekly', 'month', 'year'];

export type PeriodOverridesProps = Partial<Record<PeriodProps, [number, number]>>;

const periodRange = (period: PeriodProps, now: Date): [number, number] => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  switch (period) {
    case 'week': {
      const weekday = (now.getDay() + 6) % 7;
      return [
        new Date(year, month, day - weekday).getTime(),
        new Date(year, month, day - weekday + 7).getTime(),
      ];
    }
    case 'biweekly':
      return day <= 15
        ? [new Date(year, month, 1).getTime(), new Date(year, month, 16).getTime()]
        : [new Date(year, month, 16).getTime(), new Date(year, month + 1, 1).getTime()];
    case 'month':
      return [new Date(year, month, 1).getTime(), new Date(year, month + 1, 1).getTime()];
    case 'year':
      return [new Date(year, 0, 1).getTime(), new Date(year + 1, 0, 1).getTime()];
  }
};

export const movementsInPeriod = (
  movements: MovementProps[],
  period: PeriodProps,
  now: Date,
  overrides?: PeriodOverridesProps,
) => {
  const [start, end] = overrides?.[period] ?? periodRange(period, now);

  return movements.filter((movement) => {
    const time = new Date(movement.date).getTime();
    return time >= start && time < end;
  });
};

export const periodTotals = (
  movements: MovementProps[],
  now: Date,
  overrides?: PeriodOverridesProps,
) => {
  const ranges = PERIODS.map((period) => overrides?.[period] ?? periodRange(period, now));
  const totals = PERIODS.map(() => ({income: 0, expense: 0}));

  for (const movement of movements) {
    const time = new Date(movement.date).getTime();
    if (Number.isNaN(time)) continue;

    ranges.forEach(([start, end], index) => {
      if (time < start || time >= end) return;
      if (movement.type === 'income') totals[index].income += movement.amount;
      else totals[index].expense += movement.amount;
    });
  }

  return totals.map(({income, expense}) => ({income, expense, balance: income - expense}));
};
