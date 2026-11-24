import {useMemo} from 'react';

import {useMovementsStore} from '@/features/expenses';
import {useActiveCycle, useIncomeStore} from '@/features/income';

import {useBudgetsStore} from '../store';
import {getBudgetTheme, type BudgetThemeProps} from '../themes';
import type {BudgetProps} from '../types';
import {spentByBudgetInCycle} from '../utils';

export type BudgetRowItemProps = {
  budget: BudgetProps;
  theme: BudgetThemeProps;
  spent: number;
  available: number;
  ratio: number;
};

export const useBudgetsOverview = () => {
  const config = useIncomeStore((s) => s.config);
  const budgets = useBudgetsStore((s) => s.items);
  const movements = useMovementsStore((s) => s.items);
  const cycle = useActiveCycle();

  return useMemo(() => {
    if (!cycle) return null;

    const spentMap = spentByBudgetInCycle(movements, cycle);

    const rows: BudgetRowItemProps[] = budgets.map((budget) => {
      const spent = spentMap.get(budget.id) ?? 0;

      return {
        budget,
        theme: getBudgetTheme(budget.themeId),
        spent,
        available: budget.assigned - spent,
        ratio: budget.assigned > 0 ? spent / budget.assigned : 0,
      };
    });

    const assigned = rows.reduce((sum, row) => sum + row.budget.assigned, 0);
    const spent = rows.reduce((sum, row) => sum + row.spent, 0);
    const income = config?.amount ?? null;
    const toAssign = income === null ? null : income - assigned;

    return {rows, assigned, spent, income, toAssign};
  }, [cycle, config, budgets, movements]);
};
