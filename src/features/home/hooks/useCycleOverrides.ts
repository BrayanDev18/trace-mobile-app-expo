import {useMemo} from 'react';

import {activeCycle, cyclePeriodKey, useIncomeStore} from '@/features/income';

import type {PeriodOverridesProps} from '../utils';

export const useCycleOverrides = (): PeriodOverridesProps => {
  const config = useIncomeStore((s) => s.config);

  return useMemo(() => {
    if (!config) return {};
    const cycle = activeCycle(config, new Date());
    return {[cyclePeriodKey(config.frequency)]: [cycle.start.getTime(), cycle.end.getTime()]};
  }, [config]);
};
