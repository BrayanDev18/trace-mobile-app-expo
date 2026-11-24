import {useMemo} from 'react';

import {useMovementsStore} from '@/features/expenses';
import {useCycleOverview, type CycleRangeProps} from '@/features/income';

export type HomeBalanceProps = {
  state: 'unset' | 'amountless' | 'ready';
  amount: number;
  ratio: number | null;
  cycle: CycleRangeProps | null;
  daysLeft: number;
  income: number;
  committed: number;
  spent: number;
};

export const useHomeBalance = (): HomeBalanceProps => {
  const overview = useCycleOverview();
  const movements = useMovementsStore((s) => s.items);

  return useMemo(() => {
    if (!overview) {
      const totals = movements.reduce(
        (acc, movement) =>
          movement.type === 'income'
            ? {...acc, income: acc.income + movement.amount}
            : {...acc, spent: acc.spent + movement.amount},
        {income: 0, spent: 0},
      );

      return {
        state: 'unset',
        amount: totals.income - totals.spent,
        ratio: null,
        cycle: null,
        daysLeft: 0,
        income: totals.income,
        committed: 0,
        spent: totals.spent,
      };
    }

    const {cycle, daysLeft, income, committed, spent, available, ratio} = overview;

    return {
      state: available === null ? 'amountless' : 'ready',
      amount: available ?? spent,
      ratio,
      cycle,
      daysLeft,
      income: income ?? 0,
      committed,
      spent,
    };
  }, [overview, movements]);
};
