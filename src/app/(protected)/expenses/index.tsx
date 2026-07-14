import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import {HorizontalCalendar, Screen, Text} from '@/components';
import {getCategory} from '@/constants';
import {useMovementsStore, type Movement} from '@/store/movements';
import {formatCurrency, sameDay} from '@/utils';

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const Gap = () => <View className="h-2" />;

const ExpenseRow = ({expense}: {expense: Movement}) => {
  const category = getCategory(expense.categoryId);
  const Icon = category.icon;

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-white/5 px-4 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{backgroundColor: `${category.tint}22`}}
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
};

const ExpensesScreen = () => {
  const [selected, setSelected] = useState(() => new Date());
  const movements = useMovementsStore((s) => s.items);

  const expenses = useMemo(
    () =>
      movements.filter(
        (m) => m.type === 'expense' && sameDay(new Date(m.date), selected),
      ),
    [movements, selected],
  );
  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const dayLabel = `${selected.getDate()} de ${MONTHS[selected.getMonth()]}`;

  return (
    <Screen>
      <View className="flex-1">
        <FlashList
          data={expenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 16}}
          ItemSeparatorComponent={Gap}
          ListHeaderComponent={
            <View className="gap-6 pb-6">
              <HorizontalCalendar selected={selected} onSelect={setSelected} />

              <View className="flex-row items-center justify-between">
                <Text className="font-satoshi-bold">Gastos · {dayLabel}</Text>
                <Text
                  className="font-satoshi-bold text-red-500"
                  style={{fontVariant: ['tabular-nums']}}
                >
                  ${formatCurrency(total)}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center gap-2 py-12">
              <Text className="font-satoshi-medium text-secundary">Sin gastos este día</Text>
              <Text className="text-center text-sm text-secundary">
                Toca + para registrar un gasto.
              </Text>
            </View>
          }
          renderItem={({item}) => <ExpenseRow expense={item} />}
        />
      </View>
    </Screen>
  );
};

export default ExpensesScreen;
