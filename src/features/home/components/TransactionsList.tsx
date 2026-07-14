import {View, Pressable} from 'react-native';

import {Group, Text} from '@/components';
import {TransactionRow, useMovementsStore} from '@/features/expenses';

const RECENT_COUNT = 5;

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

          {recent.length > 0 && (
            <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-50">
              <Text className="text-accent dark:text-teal-400">Ver todas</Text>
            </Pressable>
          )}
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