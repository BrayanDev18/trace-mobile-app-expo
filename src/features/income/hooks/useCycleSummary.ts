import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {type Icon} from '@tabler/icons-react-native';

import {getCategory} from '@/constants';
import {useMovementsStore} from '@/features/expenses';
import {useSavingsStore} from '@/features/savings';
import {haptic} from '@/utils';

import {useIncomeStore} from '../store';
import {
  activeCycle,
  cycleRecap,
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
  const savings = useSavingsStore((s) => s.savings);
  const addContribution = useSavingsStore((s) => s.addContribution);

  const summary = useMemo(() => {
    if (!config || !summarySeenAt) return null;

    const now = new Date();
    const cycle = activeCycle(config, now);
    if (new Date(summarySeenAt).getTime() >= cycle.start.getTime()) return null;

    const closed = previousCycle(config, now);
    const recap = cycleRecap(movements, config, closed);
    if (recap.spent === 0 && recap.registered === 0) return null;

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

    const previousSpent = spentInCycle(movements, previousCycle(config, closed.start));

    return {...recap, top, previousSpent};
  }, [config, summarySeenAt, movements, t]);

  const openSavings = useMemo(() => savings.filter((s) => !s.archivedAt), [savings]);

  const moveLeftover = (savingId: string) => {
    const leftover = summary?.leftover;
    if (!leftover || leftover <= 0) return;

    haptic.success();
    addContribution({savingId, amount: leftover});
    markSummarySeen();
  };

  return {summary, savings: openSavings, moveLeftover, dismiss: markSummarySeen};
};
