import {memo} from 'react';
import {View} from 'react-native';

import {Text} from '@/components';
import {getCategory} from '@/constants';
import type {Movement} from '../types';
import {formatCurrency} from '@/utils';

type ExpenseRowProps = {
  expense: Movement;
};

export const ExpenseRow = memo(function ExpenseRow({expense}: ExpenseRowProps) {
  const category = getCategory(expense.categoryId);
  const Icon = category.icon;

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-white/5 px-4 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{backgroundColor: `${category.tint}1f`}}
      >
        <Icon size={18} color={category.tint} />
      </View>

      <View className="flex-1">
        <Text className="font-satoshi-medium">{expense.reason}</Text>
        <Text className="text-xs text-secundary">{category.label}</Text>
      </View>

      <Text className="font-satoshi-bold" style={{fontVariant: ['tabular-nums']}}>
        ${formatCurrency(expense.amount)}
      </Text>
    </View>
  );
});
