import {View, Pressable, useColorScheme} from 'react-native';
import {router} from 'expo-router';

import {Group, Text} from '@/components';
import {DynamicRoutes, getCategory, getPaymentMethod} from '@/constants';
import {useMovementsStore, type Movement} from '@/store/movements';
import {cn, formatCurrency, relativeDate, timeLabel} from '@/utils';

const RECENT_COUNT = 6;

const TransactionRow = ({movement}: {movement: Movement}) => {
  const category = getCategory(movement.categoryId);
  const Icon = category.icon;
  const isIncome = movement.type === 'income';
  const scheme = useColorScheme();
  const glyph = scheme === 'dark' ? '#ffffff' : '#000000';

  const date = new Date(movement.date);
  const method = movement.methodId ? getPaymentMethod(movement.methodId) : undefined;

  return (
    <Pressable
      onPress={() => router.push(DynamicRoutes.expense(movement.id))}
      className="flex-row items-center gap-3 px-4 py-2 active:bg-neutral-200 dark:active:bg-white/5"
    >
      <View
        className="h-14 w-14 items-center justify-center rounded-xl bg-tertiary"
      >
        <Icon size={25} color={glyph}/>
      </View>

      <View className="flex-1 gap-1">
        <Text numberOfLines={1} className="font-satoshi-medium text-[16px]">
          {movement.reason}
        </Text>

        <Text numberOfLines={1} className="text-sm text-secundary">
          {relativeDate(date)}
          {method ? ` · ${method.label}` : ''}
        </Text>
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
};

type TransactionsListProps = {
  onSeeAll?: () => void;
};

export const TransactionsList = ({onSeeAll}: TransactionsListProps) => {
  const movements = useMovementsStore((s) => s.items);
  const recent = movements.slice(0, RECENT_COUNT);

  return (
    <View className="gap-2">
      <Group className="gap-3">
        <View className="flex-row items-baseline justify-between px-4 pt-4">
          <Text className="text-xl font-satoshi-medium">
            Transacciones recientes
          </Text>

          <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-50">
            <Text className="text-accent dark:text-teal-400">Ver todas</Text>
          </Pressable>
        </View>

        {recent.length === 0 ? (
          <View className="items-center gap-1 px-4 pb-8 pt-4">
            <Text className="font-satoshi-medium text-xl">
              Sin movimientos aún
            </Text>
            <Text className="text-center text-secundary text-lg">
              Toca + para registrar tu primer gasto.
            </Text>
          </View>
        ) : (
          <View className="gap-2 pb-3">
            {recent.map((movement) => (
              <TransactionRow key={movement.id} movement={movement}/>
            ))}
          </View>
        )}
      </Group>
    </View>
  );
};
