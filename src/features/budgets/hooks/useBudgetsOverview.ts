import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {type Icon} from '@tabler/icons-react-native';

import {categoriesByKind, getCategory} from '@/constants';
import {useMovementsStore} from '@/features/expenses';
import {
  activeCycle,
  previousCycle,
  spentByCategoryInCycle,
  useIncomeStore,
  type CycleRangeProps,
} from '@/features/income';

import {useBudgetsStore} from '../store';

export type BudgetRowItemProps = {
  categoryId: string;
  label: string;
  icon: Icon;
  tint: string;
  cap: number;
  spent: number;
  ratio: number;
};

const calendarMonth = (now: Date, offset = 0): CycleRangeProps => ({
  start: new Date(now.getFullYear(), now.getMonth() + offset, 1),
  end: new Date(now.getFullYear(), now.getMonth() + offset + 1, 1),
});

export const useBudgetsOverview = () => {
  const {t} = useTranslation();
  const config = useIncomeStore((s) => s.config);
  const budgets = useBudgetsStore((s) => s.items);
  const upsert = useBudgetsStore((s) => s.upsert);
  const movements = useMovementsStore((s) => s.items);

  return useMemo(() => {
    const now = new Date();
    const cycle = config ? activeCycle(config, now) : calendarMonth(now);
    const spentMap = spentByCategoryInCycle(movements, cycle);

    const rows: BudgetRowItemProps[] = budgets.map((budget) => {
      const category = getCategory(budget.categoryId);
      const spent = spentMap.get(budget.categoryId) ?? 0;

      return {
        categoryId: budget.categoryId,
        label: t(category.labelKey),
        icon: category.icon,
        tint: category.tint,
        cap: budget.cap,
        spent,
        ratio: budget.cap > 0 ? spent / budget.cap : 0,
      };
    });

    const availableCategories = categoriesByKind('expense').filter(
      (category) => !budgets.some((budget) => budget.categoryId === category.id),
    );

    const totals = rows.reduce(
      (acc, row) => ({cap: acc.cap + row.cap, spent: acc.spent + row.spent}),
      {cap: 0, spent: 0},
    );

    const history = spentByCategoryInCycle(
      movements,
      config ? previousCycle(config, now) : calendarMonth(now, -1),
    );

    const bootstrap = () => {
      history.forEach((spent, categoryId) => upsert(categoryId, spent));
    };

    return {rows, availableCategories, totals, historyCount: history.size, bootstrap, cycle};
  }, [config, budgets, movements, upsert, t]);
};