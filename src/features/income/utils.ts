import type {DebtPaymentProps, DebtProps} from '@/features/debts';
import {debtPaid} from '@/features/debts';
import type {MovementProps} from '@/features/expenses';
import type {SubscriptionProps} from '@/features/subscriptions';

import type {CycleRangeProps, IncomeConfigProps, PayFrequencyProps} from './types';

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

export const cycleDaysLeft = (cycle: CycleRangeProps, now: Date) =>
  Math.max(0, Math.ceil((cycle.end.getTime() - now.getTime()) / DAY_MS));

export const cyclePeriodKey = (frequency: PayFrequencyProps) =>
  ({weekly: 'week', biweekly: 'biweekly', monthly: 'month'} as const)[frequency];

const inCycle = (iso: string, cycle: CycleRangeProps) => {
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

export const spentByCategoryInCycle = (movements: MovementProps[], cycle: CycleRangeProps) => {
  const totals = new Map<string, number>();
  for (const movement of movements) {
    if (movement.type !== 'expense' || !inCycle(movement.date, cycle)) continue;
    totals.set(movement.categoryId, (totals.get(movement.categoryId) ?? 0) + movement.amount);
  }
  return totals;
};

export const committedInCycle = (
  cycle: CycleRangeProps,
  subscriptions: SubscriptionProps[],
  debts: DebtProps[],
  payments: DebtPaymentProps[],
) => {
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

  return fromSubscriptions + fromDebts;
};
