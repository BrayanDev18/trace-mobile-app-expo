import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {Header, HorizontalCalendar, Screen, Text,EmptyState,ListGap} from '@/components';
import {ScreenRoutes} from '@/constants';
import {ExpenseRow} from '@/features/expenses';
import {useMovementsStore, type MovementProps} from '@/features/expenses';
import {dayMonthLabel, formatCurrency, sameDay} from '@/utils';

const keyExtractor = (item: MovementProps) => item.id;
const goNewExpense = () => router.push(ScreenRoutes.newExpense);

const ExpensesScreen = () => {
  const {t} = useTranslation();
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

  return (
    <Screen>
      <Header title={t('expenses:title')} />

      <View className="flex-1">
        <FlashList
          data={expenses}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 16}}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            <View className="gap-6 pb-6">
              <HorizontalCalendar selected={selected} onSelect={setSelected} />

              <View className="flex-row items-center justify-between">
                <Text className="font-satoshi-bold">
                  {t('expenses:listHeading', {date: dayMonthLabel(selected)})}
                </Text>
                <Text
                  className="font-satoshi-bold text-red-400"
                  style={{fontVariant: ['tabular-nums']}}
                >
                  ${formatCurrency(total)}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title={t('expenses:empty.title')}
              subtitle={t('expenses:empty.subtitle')}
              actionLabel={t('expenses:empty.action')}
              onAction={goNewExpense}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

const renderItem: ListRenderItem<MovementProps> = ({item}) => <ExpenseRow expense={item} />;
const Separator = () => <ListGap size={2} />;

export default ExpensesScreen;