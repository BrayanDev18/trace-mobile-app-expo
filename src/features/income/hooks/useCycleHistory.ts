import {useMemo} from 'react';

import {useMovementsStore} from '@/features/expenses';

import {useIncomeStore} from '../store';
import type {CycleRecapProps} from '../types';
import {cycleRecap, previousCycle} from '../utils';

const MAX_CYCLES = 24;

export const useCycleHistory = (): CycleRecapProps[] => {
  const config = useIncomeStore((s) => s.config);
  const movements = useMovementsStore((s) => s.items);

  return useMemo(() => {
    if (!config) return [];

    const oldest = movements.reduce(
      (min, movement) => Math.min(min, new Date(movement.date).getTime()),
      Infinity,
    );

    if (!Number.isFinite(oldest)) return [];

    const history: CycleRecapProps[] = [];
    let cycle = previousCycle(config, new Date());

    while (history.length < MAX_CYCLES && cycle.end.getTime() > oldest) {
      const recap = cycleRecap(movements, config, cycle);
      if (recap.spent > 0 || recap.registered > 0) history.push(recap);
      cycle = previousCycle(config, cycle.start);
    }

    return history;
  }, [config, movements]);
};
