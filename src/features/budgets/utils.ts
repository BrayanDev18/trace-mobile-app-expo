import type {MovementProps} from '@/features/expenses';
import {inCycle, type CycleRangeProps} from '@/features/income';

export const spentByBudgetInCycle = (movements: MovementProps[], cycle: CycleRangeProps) => {
  const totals = new Map<string, number>();
  for (const movement of movements) {
    if (movement.type !== 'expense' || !movement.budgetId || !inCycle(movement.date, cycle)) continue;
    totals.set(movement.budgetId, (totals.get(movement.budgetId) ?? 0) + movement.amount);
  }
  return totals;
};