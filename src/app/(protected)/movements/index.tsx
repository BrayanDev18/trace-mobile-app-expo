import {useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {EmptyState, Group, Header, ListGap, Screen, SectionTitle} from '@/components';
import {ScreenRoutes} from '@/constants';
import {TransactionRow, useMovementsStore, type MovementProps} from '@/features/expenses';
import {relativeDate} from '@/utils';

type DayGroupProps = {
  title: string;
  movements: MovementProps[];
};

const keyExtractor = (item: DayGroupProps) => item.title;
const goNewExpense = () => router.push(ScreenRoutes.newExpense);

const MovementsScreen = () => {
  const {t} = useTranslation();
  const movements = useMovementsStore((s) => s.items);

  const groups = useMemo(() => {
    const sorted = [...movements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const result: DayGroupProps[] = [];
    for (const movement of sorted) {
      const title = relativeDate(new Date(movement.date));
      const last = result[result.length - 1];
      if (last?.title === title) last.movements.push(movement);
      else result.push({title, movements: [movement]});
    }
    return result;
  }, [movements]);

  return (
    <Screen>
      <Header title={t('movements:title')} />

      <View className="flex-1">
        <FlashList
          data={groups}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24}}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <EmptyState
              title={t('movements:empty.title')}
              subtitle={t('movements:empty.subtitle')}
              actionLabel={t('movements:empty.action')}
              onAction={goNewExpense}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

const renderItem: ListRenderItem<DayGroupProps> = ({item}) => (
  <View className="gap-2">
    <SectionTitle>{item.title}</SectionTitle>

    <Group className="py-2">
      {item.movements.map((movement) => (
        <TransactionRow key={movement.id} movement={movement} showDate={false} />
      ))}
    </Group>
  </View>
);

const Separator = () => <ListGap size={3} />;

export default MovementsScreen;