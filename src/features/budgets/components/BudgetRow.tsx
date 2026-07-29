import {Pressable, View} from 'react-native';

import {Text} from '@/components';
import {cn, formatCurrency} from '@/utils';

import type {BudgetRowItemProps} from '../hooks/useBudgetsOverview';

type BudgetRowProps = {
  item: BudgetRowItemProps;
  onPress: () => void;
};

export const BudgetRow = ({item, onPress}: BudgetRowProps) => {
  const Icon = item.icon;
  const over = item.ratio > 1;

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 active:opacity-70">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{backgroundColor: `${item.tint}1f`}}
      >
        <Icon size={18} color={item.tint} />
      </View>

      <View className="flex-1 gap-1.5">
        <View className="flex-row items-baseline justify-between gap-3">
          <Text numberOfLines={1} className="flex-1 font-satoshi-medium">
            {item.label}
          </Text>

          <Text
            className={cn('text-sm', over ? 'text-red-400' : 'text-secundary')}
            style={{fontVariant: ['tabular-nums']}}
          >
            ${formatCurrency(item.spent)} / ${formatCurrency(item.cap)}
          </Text>
        </View>

        <View className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/5">
          <View
            className={cn('h-full rounded-full', over && 'bg-red-400')}
            style={{
              width: `${Math.min(1, item.ratio) * 100}%`,
              backgroundColor: over ? undefined : item.tint,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};