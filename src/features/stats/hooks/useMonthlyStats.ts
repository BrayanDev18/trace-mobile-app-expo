import {useMemo} from 'react';
import {type Icon} from '@tabler/icons-react-native';

import {useTranslation} from 'react-i18next';

import {getCategory} from '@/constants';
import {useMovementsStore} from '@/features/expenses';
import {monthsShort} from '@/utils';

export type CategoryTotalProps = {
  id: string;
  label: string;
  icon: Icon;
  tint: string;
  total: number;
  share: number;
};

export type MonthPointProps = {
  label: string;
  expense: number;
};

const sameMonth = (date: Date, month: Date) =>
  date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();

export const useMonthlyStats = (month: Date) => {
  const movements = useMovementsStore((s) => s.items);
  const {t} = useTranslation();
  const names = monthsShort();

  return useMemo(() => {
    let income = 0;
    let expense = 0;
    const byCategory = new Map<string, number>();

    for (const movement of movements) {
      if (!sameMonth(new Date(movement.date), month)) continue;

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

    const trend: MonthPointProps[] = [];
    for (let i = 5; i >= 0; i--) {
      const point = new Date(month.getFullYear(), month.getMonth() - i, 1);
      const total = movements.reduce((sum, movement) => {
        const date = new Date(movement.date);
        return movement.type === 'expense' && sameMonth(date, point)
          ? sum + movement.amount
          : sum;
      }, 0);
      trend.push({label: names[point.getMonth()], expense: total});
    }

    return {income, expense, balance: income - expense, categories, trend};
  }, [movements, month, names, t]);
};
