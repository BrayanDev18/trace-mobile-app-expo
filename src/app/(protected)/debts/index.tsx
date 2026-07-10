import {useMemo} from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {IconPlus} from '@tabler/icons-react-native';

import {Header, Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {DebtCard, DebtsOverview} from '@/screens/debts';
import {debtPaid, useDebtsStore} from '@/store/debts';

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

  const lentDebts = active.filter(({debt}) => debt.direction === 'lent');
  const owedDebts = active.filter(({debt}) => debt.direction === 'owed');

  return (
    <Screen scroll>
      <Header title="Deudas" />

      <View className="gap-6 px-5 py-4">
        {active.length === 0 ? (
          <View className="items-center gap-3 py-12 w-full">
            <Text className="font-satoshi-medium text-xl">Sin deudas activas</Text>

            <Text className="text-center text-lg text-secundary">
              Registra lo que te deben o lo que debes
            </Text>

            <Pressable
              onPress={() => router.push(ScreenRoutes.newDebt)}
              className="h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary w-full"
            >
              <IconPlus size={18} color={dark ? '#ffffff' : '#171717'} />
              <Text className="font-satoshi-bold text-sm">Nueva deuda</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <DebtsOverview
              lent={totals.lent}
              owed={totals.owed}
              count={active.length}
              onAdd={() => router.push(ScreenRoutes.newDebt)}
            />

            {lentDebts.length > 0 && (
              <View className="gap-3">
                <Text className="px-4 font-satoshi-medium text-lg">Me deben</Text>

                <View className="gap-3">
                  {lentDebts.map(({debt, paid}) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      paid={paid}
                      onPress={() => router.push(DynamicRoutes.debt(debt.id))}
                    />
                  ))}
                </View>
              </View>
            )}

            {owedDebts.length > 0 && (
              <View className="gap-3">
                <Text className="px-4 font-satoshi-medium text-lg">Yo debo</Text>

                <View className="gap-3">
                  {owedDebts.map(({debt, paid}) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      paid={paid}
                      onPress={() => router.push(DynamicRoutes.debt(debt.id))}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </Screen>
  );
};

export default DebtsScreen;
