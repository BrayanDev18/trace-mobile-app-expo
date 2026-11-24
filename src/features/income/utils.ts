import {debtPaid} from '@/features/debts';
import type {MovementProps} from '@/features/expenses';
import type {SavingContributionProps, SavingProps} from '@/features/savings';
import {savingSaved} from '@/features/savings';

import type {
  CommitmentsProps,
  CycleRangeProps,
  CycleRecapProps,
  IncomeConfigProps,
  PayFrequencyProps,
} from './types';

const DAY_MS = 86_400_000;

const clampToMonth = (year: number, month: number, day: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
};

const monthBoundaries = (config: IncomeConfigProps, year: number, month: number): Date[] =>
  config.frequency === 'monthly'
    ? [clampToMonth(year, month, config.payday)]
    : [clampToMonth(year, month, config.payday), clampToMonth(year, month, config.payday + 15)];

export const activeCycle = (config: IncomeConfigProps, now: Date): CycleRangeProps => {
  if (config.frequency === 'weekly') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setDate(start.getDate() - ((start.getDay() - config.payday + 7) % 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return {start, end};
  }

  const boundaries: Date[] = [];
  for (let offset = -1; offset <= 1; offset++) {
    const anchor = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    boundaries.push(...monthBoundaries(config, anchor.getFullYear(), anchor.getMonth()));
  }
  boundaries.sort((a, b) => a.getTime() - b.getTime());

  const start = [...boundaries].reverse().find((b) => b.getTime() <= now.getTime())!;
  const end = boundaries.find((b) => b.getTime() > start.getTime())!;
  return {start, end};
};

export const previousCycle = (config: IncomeConfigProps, now: Date): CycleRangeProps =>
  activeCycle(config, new Date(activeCycle(config, now).start.getTime() - 1));

export const cycleAt = (
  config: IncomeConfigProps,
  now: Date,
  offset: number,
): CycleRangeProps => {
  let cycle = activeCycle(config, now);

  for (let step = 0; step < Math.abs(offset); step++) {
    cycle =
      offset < 0
        ? activeCycle(config, new Date(cycle.start.getTime() - 1))
        : activeCycle(config, cycle.end);
  }

  return cycle;
};

const RECURRING_TOLERANCE = 0.2;

const uniqueDays = (movements: MovementProps[]) => {
  const seen = new Set<string>();
  const dates: Date[] = [];

  for (const movement of movements) {
    const date = new Date(movement.date);
    const key = date.toDateString();
    if (seen.has(key)) continue;
    seen.add(key);
    dates.push(date);
  }

  return dates;
};

const medianGapDays = (dates: Date[]) => {
  const gaps = dates
    .slice(1)
    .map((date, index) => (date.getTime() - dates[index].getTime()) / DAY_MS)
    .sort((a, b) => a - b);

  return gaps.length ? gaps[Math.floor(gaps.length / 2)] : null;
};

const frequencyFromGap = (gap: number | null): PayFrequencyProps => {
  if (gap === null) return 'monthly';
  if (gap < 11) return 'weekly';
  if (gap < 24) return 'biweekly';
  return 'monthly';
};

export const detectCycle = (movements: MovementProps[]): IncomeConfigProps | null => {
  const incomes = movements
    .filter((movement) => movement.type === 'income')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const latest = incomes[incomes.length - 1];
  if (!latest) return null;

  const recurring = incomes.filter(
    (movement) => Math.abs(movement.amount - latest.amount) <= latest.amount * RECURRING_TOLERANCE,
  );

  const dates = uniqueDays(recurring);
  const frequency = frequencyFromGap(medianGapDays(dates));
  const last = dates[dates.length - 1];
  const dayOfMonth = last.getDate();

  const payday = {
    weekly: last.getDay(),
    biweekly: dayOfMonth > 15 ? dayOfMonth - 15 : dayOfMonth,
    monthly: dayOfMonth,
  }[frequency];

  return {amount: latest.amount, frequency, payday};
};

export const cycleDaysLeft = (cycle: CycleRangeProps, now: Date) =>
  Math.max(0, Math.ceil((cycle.end.getTime() - now.getTime()) / DAY_MS));

export const cyclePeriodKey = (frequency: PayFrequencyProps) =>
  ({weekly: 'week', biweekly: 'biweekly', monthly: 'month'} as const)[frequency];

export const inCycle = (iso: string, cycle: CycleRangeProps) => {
  const time = new Date(iso).getTime();
  return time >= cycle.start.getTime() && time < cycle.end.getTime();
};

export const spentInCycle = (movements: MovementProps[], cycle: CycleRangeProps) =>
  movements.reduce(
    (sum, movement) =>
      movement.type === 'expense' && inCycle(movement.date, cycle) ? sum + movement.amount : sum,
    0,
  );

export const incomeInCycle = (movements: MovementProps[], cycle: CycleRangeProps) =>
  movements.reduce(
    (sum, movement) =>
      movement.type === 'income' && inCycle(movement.date, cycle) ? sum + movement.amount : sum,
    0,
  );

export const cycleRecap = (
  movements: MovementProps[],
  config: IncomeConfigProps,
  cycle: CycleRangeProps,
): CycleRecapProps => {
  const spent = spentInCycle(movements, cycle);
  const registered = incomeInCycle(movements, cycle);
  const received = config.amount ?? (registered > 0 ? registered : null);

  return {
    cycle,
    spent,
    registered,
    received,
    leftover: received === null ? null : received - spent,
  };
};

export const spentByCategoryInCycle = (movements: MovementProps[], cycle: CycleRangeProps) => {
  const totals = new Map<string, number>();
  for (const movement of movements) {
    if (movement.type !== 'expense' || !inCycle(movement.date, cycle)) continue;
    totals.set(movement.categoryId, (totals.get(movement.categoryId) ?? 0) + movement.amount);
  }
  return totals;
};

export const savingsPlanInCycle = (
  savings: SavingProps[],
  contributions: SavingContributionProps[],
  cycle: CycleRangeProps,
) => {
  const cycleLength = cycle.end.getTime() - cycle.start.getTime();

  return savings.reduce((sum, saving) => {
    if (saving.archivedAt) return sum;

    const contributed = contributions.reduce(
      (total, contribution) =>
        contribution.savingId === saving.id && inCycle(contribution.date, cycle)
          ? total + contribution.amount
          : total,
      0,
    );

    if (!saving.targetAmount || !saving.deadline) return sum + contributed;

    const remaining = Math.max(0, saving.targetAmount - savingSaved(contributions, saving.id));
    const cyclesLeft = Math.max(
      1,
      Math.ceil((new Date(saving.deadline).getTime() - cycle.start.getTime()) / cycleLength),
    );

    return sum + Math.max(remaining / cyclesLeft, contributed);
  }, 0);
};

export const committedInCycle = (props: CommitmentsProps) => {
  const {cycle, subscriptions, debts, payments, savings, contributions} = props;

  const fromSubscriptions = subscriptions.reduce(
    (sum, subscription) =>
      inCycle(subscription.nextCharge, cycle) ? sum + subscription.price : sum,
    0,
  );

  const fromDebts = debts.reduce((sum, debt) => {
    if (debt.direction !== 'owed' || debt.settledAt) return sum;
    if (!debt.dueDate || !inCycle(debt.dueDate, cycle)) return sum;
    return sum + Math.max(0, debt.amount - debtPaid(payments, debt.id));
  }, 0);

  return fromSubscriptions + fromDebts + savingsPlanInCycle(savings, contributions, cycle);
};
