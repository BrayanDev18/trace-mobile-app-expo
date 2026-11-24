import {useMemo} from 'react';
import {type Icon} from '@tabler/icons-react-native';
import {useTranslation} from 'react-i18next';

import {getCategory} from '@/constants';
import {useMovementsStore} from '@/features/expenses';
import {
  cycleAt,
  inCycle,
  previousCycle,
  spentInCycle,
  useIncomeStore,
  type CycleRangeProps,
} from '@/features/income';
import {shortDate} from '@/utils';

const TREND_LENGTH = 6;

export type CategoryTotalProps = {
  id: string;
  label: string;
  icon: Icon;
  tint: string;
  total: number;
  share: number;
};

export type TrendPointProps = {
  id: string;
  label: string;
  expense: number;
};

export type CycleStatsProps = {
  cycle: CycleRangeProps | null;
  income: number;
  expense: number;
  balance: number;
  categories: CategoryTotalProps[];
  trend: TrendPointProps[];
};

export const useCycleStats = (offset: number): CycleStatsProps => {
  const movements = useMovementsStore((s) => s.items);
  const config = useIncomeStore((s) => s.config);
  const {t} = useTranslation();

  return useMemo(() => {
    const cycle = config ? cycleAt(config, new Date(), offset) : null;

    let income = 0;
    let expense = 0;
    const byCategory = new Map<string, number>();

    for (const movement of movements) {
      if (cycle && !inCycle(movement.date, cycle)) continue;

      if (movement.type === 'income') {
        income += movement.amount;
      } else {
        expense += movement.amount;
        byCategory.set(
          movement.categoryId,
          (byCategory.get(movement.categoryId) ?? 0) + movement.amount,
        );
      }
    }

    const categories: CategoryTotalProps[] = [...byCategory.entries()]
      .map(([id, total]) => {
        const category = getCategory(id);
        return {
          id,
          label: t(category.labelKey),
          icon: category.icon,
          tint: category.tint,
          total,
          share: expense > 0 ? total / expense : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    const trend: TrendPointProps[] = [];
    let point = cycle;

    while (config && point && trend.length < TREND_LENGTH) {
      trend.unshift({
        id: point.start.toISOString(),
        label: shortDate(point.start),
        expense: spentInCycle(movements, point),
      });
      point = previousCycle(config, point.start);
    }

    return {cycle, income, expense, balance: income - expense, categories, trend};
  }, [movements, config, offset, t]);
};
