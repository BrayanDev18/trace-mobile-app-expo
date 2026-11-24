import {useMemo} from 'react';

import {useDebtsStore} from '@/features/debts';
import {useMovementsStore} from '@/features/expenses';
import {useSavingsStore} from '@/features/savings';
import {useSubscriptionsStore} from '@/features/subscriptions';

import {useIncomeStore} from '../store';
import {activeCycle, committedInCycle, cycleDaysLeft, spentInCycle} from '../utils';

export const useCycleOverview = () => {
  const config = useIncomeStore((s) => s.config);
  const movements = useMovementsStore((s) => s.items);
  const subscriptions = useSubscriptionsStore((s) => s.items);
  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);
  const savings = useSavingsStore((s) => s.savings);
  const contributions = useSavingsStore((s) => s.contributions);

  return useMemo(() => {
    if (!config) return null;

    const now = new Date();
    const cycle = activeCycle(config, now);
    const spent = spentInCycle(movements, cycle);
    const committed = committedInCycle({
      cycle,
      subscriptions,
      debts,
      payments,
      savings,
      contributions,
    });
    const income = config.amount;
    const available = income === null ? null : income - committed - spent;
    const ratio = income ? Math.min(1, (spent + committed) / income) : null;

    return {cycle, daysLeft: cycleDaysLeft(cycle, now), income, committed, spent, available, ratio};
  }, [config, movements, subscriptions, debts, payments, savings, contributions]);
};