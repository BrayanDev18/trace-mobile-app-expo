import {memo} from 'react';
import {Pressable, View} from 'react-native';

import {Text} from '@/components';
import {Colors} from '@/constants';
import type {Debt} from '../types';
import {formatCurrency, shortDate} from '@/utils';

type DebtCardProps = {
  debt: Debt;
  paid: number;
  onPress?: () => void;
};

export const DebtCard = memo(function DebtCard({debt, paid, onPress}: DebtCardProps) {
  const isLent = debt.direction === 'lent';
  const tint = isLent ? Colors.up : Colors.down;
  const remaining = Math.max(0, debt.amount - paid);
  const initial = debt.person.trim().charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl bg-secundary p-3 active:opacity-70"
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-xl"
        style={{backgroundColor: `${tint}1f`}}
      >
        <Text className="font-satoshi-bold text-lg" style={{color: tint}}>
          {initial}
        </Text>
      </View>

      <View className="flex-1">
        <Text numberOfLines={1} className="font-satoshi-medium text-[16px]">
          {debt.person}
        </Text>
        <Text numberOfLines={1} className="text-sm text-secundary">
          {isLent ? 'Te debe' : 'Le debes'}
          {debt.dueDate ? ` · vence ${shortDate(new Date(debt.dueDate))}` : ''}
        </Text>
      </View>

      <View className="items-end">
        <Text
          className="font-satoshi-bold"
          style={{color: tint, fontVariant: ['tabular-nums']}}
        >
          {isLent ? '+' : '-'}${formatCurrency(remaining)}
        </Text>
        {paid > 0 && (
          <Text className="text-xs text-secundary" style={{fontVariant: ['tabular-nums']}}>
            de ${formatCurrency(debt.amount)}
          </Text>
        )}
      </View>
    </Pressable>
  );
});
