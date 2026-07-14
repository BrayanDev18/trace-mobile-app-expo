import {memo} from 'react';
import {Pressable, View} from 'react-native';
import {router} from 'expo-router';

import {Text} from '@/components';
import {DynamicRoutes, getCategory, getPaymentMethod} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';
import {cn, formatCurrency, relativeDate, timeLabel} from '@/utils';

import {type MovementProps} from '../types';

type TransactionRowProps = {
  movement: MovementProps;
  showDate?: boolean;
};

export const TransactionRow = memo(function TransactionRow(props: TransactionRowProps) {
  const {movement, showDate = true} = props;

  const category = getCategory(movement.categoryId);
  const Icon = category.icon;
  const isIncome = movement.type === 'income';
  const glyph = useIconColors().primary;

  const date = new Date(movement.date);
  const method = movement.methodId ? getPaymentMethod(movement.methodId) : undefined;
  const meta = [showDate ? relativeDate(date) : null, method?.label]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={() => router.push(DynamicRoutes.expense(movement.id))}
      className="flex-row items-center gap-3 px-4 py-2 active:bg-neutral-200 dark:active:bg-white/5"
    >
      <View className="h-14 w-14 items-center justify-center rounded-xl bg-tertiary">
        <Icon size={25} color={glyph}/>
      </View>

      <View className="flex-1 gap-1">
        <Text numberOfLines={1} className="font-satoshi-medium text-[16px]">
          {movement.reason}
        </Text>

        {meta ? (
          <Text numberOfLines={1} className="text-sm text-secundary">
            {meta}
          </Text>
        ) : null}
      </View>

      <View className="gap-1 items-end">
        <Text
          className={cn(
            'font-satoshi-medium',
            isIncome && 'text-accent dark:text-teal-400',
          )}
          style={{fontVariant: ['tabular-nums']}}
        >
          {isIncome ? '+' : '-'}${formatCurrency(movement.amount)}
        </Text>

        <Text className="text-sm text-secundary">{timeLabel(date)}</Text>
      </View>
    </Pressable>
  );
});
