import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {useMovementsStore} from '@/features/expenses';

import {PERIODS, periodTotals, type OverviewProps, type PeriodProps} from '../utils';
import {useCycleOverrides} from './useCycleOverrides';

export const useBalanceOverview = () => {
  const {t} = useTranslation();
  const movements = useMovementsStore((s) => s.items);
  const overrides = useCycleOverrides();
  const [period, setPeriod] = useState<PeriodProps>('month');

  const overviews = useMemo<OverviewProps[]>(() => {
    const totals = periodTotals(movements, new Date(), overrides);

    return PERIODS.map((key, index) => ({
      period: key,
      label: t(`home:overview.periods.${key}`),
      caption: t(`home:overview.balance.${key}`),
      ...totals[index],
    }));
  }, [movements, overrides, t]);

  const current = overviews.find((item) => item.period === period) ?? overviews[0];

  return {overviews, current, setPeriod};
};
