import {memo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {getCategory} from '@/constants';
import type {MovementProps} from '../types';
import {formatCurrency} from '@/utils';

type ExpenseRowProps = {
  expense: MovementProps;
};

export const ExpenseRow = memo(function ExpenseRow({expense}: ExpenseRowProps) {
  const {t} = useTranslation();
  const category = getCategory(expense.categoryId);
  const Icon = category.icon;
  const categoryLabel = t(category.labelKey);

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-white/5 px-4 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{backgroundColor: `${category.tint}1f`}}
      >
        <Icon size={18} color={category.tint} />
      </View>

      <View className="flex-1">
        <Text className="font-satoshi-medium">{expense.reason || categoryLabel}</Text>
        {expense.reason ? <Text className="text-xs text-secundary">{categoryLabel}</Text> : null}
      </View>

      <Text className="font-satoshi-bold" style={{fontVariant: ['tabular-nums']}}>
        ${formatCurrency(expense.amount)}
      </Text>
    </View>
  );
});
