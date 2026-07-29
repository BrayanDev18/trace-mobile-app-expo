import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {type Icon} from '@tabler/icons-react-native';

import {getCategory} from '@/constants';
import {useMovementsStore} from '@/features/expenses';

import {useIncomeStore} from '../store';
import {
  activeCycle,
  incomeInCycle,
  previousCycle,
  spentByCategoryInCycle,
  spentInCycle,
} from '../utils';

export type SummaryCategoryProps = {
  categoryId: string;
  label: string;
  icon: Icon;
  tint: string;
  total: number;
};

export const useCycleSummary = () => {
  const {t} = useTranslation();
  const config = useIncomeStore((s) => s.config);
  const summarySeenAt = useIncomeStore((s) => s.summarySeenAt);
  const markSummarySeen = useIncomeStore((s) => s.markSummarySeen);
  const movements = useMovementsStore((s) => s.items);

  const summary = useMemo(() => {
    if (!config || !summarySeenAt) return null;

    const now = new Date();
    const cycle = activeCycle(config, now);
    if (new Date(summarySeenAt).getTime() >= cycle.start.getTime()) return null;

    const closed = previousCycle(config, now);
    const spent = spentInCycle(movements, closed);
    const registered = incomeInCycle(movements, closed);
    if (spent === 0 && registered === 0) return null;

    const received = config.amount ?? (registered > 0 ? registered : null);
    const leftover = received === null ? null : received - spent;

    const top: SummaryCategoryProps[] = [...spentByCategoryInCycle(movements, closed).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([categoryId, total]) => {
        const category = getCategory(categoryId);
        return {
          categoryId,
          label: t(category.labelKey),
          icon: category.icon,
          tint: category.tint,
          total,
        };
      });

    return {cycle: closed, spent, received, leftover, top};
  }, [config, summarySeenAt, movements, t]);

  return {summary, dismiss: markSummarySeen};
};
