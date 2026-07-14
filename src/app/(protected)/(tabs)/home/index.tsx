import {useMemo} from 'react';
import {ScrollView} from 'react-native';

import {Screen} from '@/components';
import {BalanceCardSkia, HomeHeader, QuickActions, TransactionsList} from '@/features/home';
import {useMovementsStore} from '@/features/expenses';
import {sameDay} from '@/utils';

export default function HomeScreen() {
  const movements = useMovementsStore((s) => s.items);

  const {daily, monthly, income, expense} = useMemo(() => {
    const now = new Date();
    const totals = {daily: 0, monthly: 0, income: 0, expense: 0};

    for (const movement of movements) {
      const date = new Date(movement.date);
      const signed = movement.type === 'income' ? movement.amount : -movement.amount;

      if (sameDay(date, now)) totals.daily += signed;

      if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        totals.monthly += signed;
        if (movement.type === 'income') totals.income += movement.amount;
        else totals.expense += movement.amount;
      }
    }

    return totals;
  }, [movements]);

  return (
    <Screen edges={['top']} asBackground={false}>
      <HomeHeader/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 20}}
      >
        <BalanceCardSkia
          overviews={[
            {label: 'Hoy', value: daily},
            {label: 'Este mes', value: monthly},
          ]}
          income={income}
          expense={expense}
          palette="esmeralda"
        />

        <QuickActions />

        <TransactionsList/>
      </ScrollView>
    </Screen>
  );
}
