import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {Header, Screen,EmptyState,ListGap,SectionTitle} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {DebtCard, DebtsOverview} from '@/features/debts';
import {debtPaid, useDebtsStore, type DebtProps} from '@/features/debts';

type RowProps =
  | {type: 'section'; title: string}
  | {type: 'debt'; debt: DebtProps; paid: number};

const LIST_CONTENT = {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24};
const getItemType = (item: RowProps) => item.type;
const keyExtractor = (item: RowProps) => (item.type === 'section' ? item.title : item.debt.id);
const goNewDebt = () => router.push(ScreenRoutes.newDebt);

const DebtsScreen = () => {
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

    const result: RowProps[] = [];
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

  const renderItem = useCallback<ListRenderItem<RowProps>>(
    ({item}) =>
      item.type === 'section' ? (
        <SectionTitle className="pt-3">{item.title}</SectionTitle>
      ) : (
        <DebtCard
          debt={item.debt}
          paid={item.paid}
          onPress={() => router.push(DynamicRoutes.debt(item.debt.id))}
        />
      ),
    [],
  );

  return (
    <Screen>
      <Header title="Deudas" />

      <View className="flex-1">
        <FlashList
          data={rows}
          getItemType={getItemType}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={LIST_CONTENT}
          ItemSeparatorComponent={ListGap}
          ListHeaderComponent={
            rows.length > 0 ? (
              <View className="pb-3">
                <DebtsOverview
                  lent={totals.lent}
                  owed={totals.owed}
                  count={active.length}
                  onAdd={goNewDebt}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="Sin deudas activas"
              subtitle="Registra lo que te deben o lo que debes"
              actionLabel="Nueva deuda"
              onAction={goNewDebt}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default DebtsScreen;