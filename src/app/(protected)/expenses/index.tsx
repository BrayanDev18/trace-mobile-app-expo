import {useMemo, useState} from 'react';
import {View} from 'react-native';

import {HorizontalCalendar, Screen, Text} from '@/components';
import {getCategory} from '@/constants';
import {useMovementsStore} from '@/store/movements';
import {formatCurrency, sameDay} from '@/utils';

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

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
    <Screen scroll>
      <View className="gap-6 py-4 h-screen">
        <HorizontalCalendar selected={selected} onSelect={setSelected} />

        <View className="flex-row items-center justify-between">
          <Text className="font-satoshi-bold">
            Gastos · {dayLabel}
          </Text>
          <Text className="font-satoshi-bold text-red-500">
            ${formatCurrency(total)}
          </Text>
        </View>

        {expenses.length === 0 ? (
          <View className="items-center gap-2 py-12">
            <Text className="font-satoshi-medium text-secundary">
              Sin gastos este día
            </Text>
            <Text className="text-sm text-secundary text-center">
              Toca + para registrar un gasto.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {expenses.map((e) => {
              const category = getCategory(e.categoryId);
              const Icon = category.icon;

              return (
                <View
                  key={e.id}
                  className="flex-row items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-white/5 px-4 py-3"
                >
                  <View className="w-9 h-9 rounded-full items-center justify-center" style={{backgroundColor: `${category.tint}22`}}>
                    <Icon size={18} color={category.tint} />
                  </View>

                  <View className="flex-1">
                    <Text className="font-satoshi-medium">
                      {e.reason}
                    </Text>
                    <Text className="text-xs text-secundary">
                      {category.label}
                    </Text>
                  </View>

                  <Text className="font-satoshi-bold">
                    ${formatCurrency(e.amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </Screen>
  );
};

export default ExpensesScreen;