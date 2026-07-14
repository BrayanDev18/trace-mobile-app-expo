import {useMemo} from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {FlashList} from '@shopify/flash-list';
import {IconPlus} from '@tabler/icons-react-native';

import {Header, Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {DebtCard, DebtsOverview} from '@/screens/debts';
import {debtPaid, useDebtsStore, type Debt} from '@/store/debts';

type Row =
  | {type: 'section'; title: string}
  | {type: 'debt'; debt: Debt; paid: number};

const Gap = () => <View className="h-3" />;

const DebtsScreen = () => {
  const dark = useColorScheme() === 'dark';

  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);

  const active = useMemo(
    () =>
      debts
        .filter((d) => !d.settledAt)
        .map((debt) => ({debt, paid: debtPaid(payments, debt.id)})),
    [debts, payments],
  );

  const totals = useMemo(
    () =>
      active.reduce(
        (acc, {debt, paid}) => {
          const remaining = Math.max(0, debt.amount - paid);
          return debt.direction === 'lent'
            ? {...acc, lent: acc.lent + remaining}
            : {...acc, owed: acc.owed + remaining};
        },
        {lent: 0, owed: 0},
      ),
    [active],
  );

  const rows = useMemo(() => {
    const lent = active.filter(({debt}) => debt.direction === 'lent');
    const owed = active.filter(({debt}) => debt.direction === 'owed');

    const result: Row[] = [];
    if (lent.length > 0) {
      result.push({type: 'section', title: 'Me deben'});
      lent.forEach(({debt, paid}) => result.push({type: 'debt', debt, paid}));
    }
    if (owed.length > 0) {
      result.push({type: 'section', title: 'Yo debo'});
      owed.forEach(({debt, paid}) => result.push({type: 'debt', debt, paid}));
    }
    return result;
  }, [active]);

  return (
    <Screen>
      <Header title="Deudas" />

      <View className="flex-1">
        <FlashList
          data={rows}
          getItemType={(item) => item.type}
          keyExtractor={(item) => (item.type === 'section' ? item.title : item.debt.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24}}
          ItemSeparatorComponent={Gap}
          ListHeaderComponent={
            rows.length > 0 ? (
              <View className="pb-3">
                <DebtsOverview
                  lent={totals.lent}
                  owed={totals.owed}
                  count={active.length}
                  onAdd={() => router.push(ScreenRoutes.newDebt)}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="w-full items-center gap-3 py-12">
              <Text className="font-satoshi-medium text-xl">Sin deudas activas</Text>

              <Text className="text-center text-lg text-secundary">
                Registra lo que te deben o lo que debes
              </Text>

              <Pressable
                onPress={() => router.push(ScreenRoutes.newDebt)}
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full btn-primary"
              >
                <IconPlus size={18} color={dark ? '#ffffff' : '#171717'} />
                <Text className="font-satoshi-bold text-sm">Nueva deuda</Text>
              </Pressable>
            </View>
          }
          renderItem={({item}) =>
            item.type === 'section' ? (
              <Text className="px-4 pt-3 font-satoshi-medium text-lg">{item.title}</Text>
            ) : (
              <DebtCard
                debt={item.debt}
                paid={item.paid}
                onPress={() => router.push(DynamicRoutes.debt(item.debt.id))}
              />
            )
          }
        />
      </View>
    </Screen>
  );
};

export default DebtsScreen;
