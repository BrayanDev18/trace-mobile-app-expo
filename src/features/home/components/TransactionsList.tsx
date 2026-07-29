import {useMemo} from 'react';
import {View, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Group, Text} from '@/components';
import {TransactionRow, useMovementsStore, type MovementProps} from '@/features/expenses';
import {relativeDate} from '@/utils';

import {movementsInPeriod, type PeriodProps} from '../utils';

const RECENT_COUNT = 5;

type TransactionsListProps = {
  period?: PeriodProps;
  onSeeAll?: () => void;
};

export const TransactionsList = ({period, onSeeAll}: TransactionsListProps) => {
  const {t} = useTranslation();
  const movements = useMovementsStore((s) => s.items);

  const groups = useMemo(() => {
    const scoped = period ? movementsInPeriod(movements, period, new Date()) : [...movements];
    const recent = scoped
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, RECENT_COUNT);

    const result: {title: string; movements: MovementProps[]}[] = [];
    for (const movement of recent) {
      const title = relativeDate(new Date(movement.date));
      const last = result[result.length - 1];
      if (last?.title === title) last.movements.push(movement);
      else result.push({title, movements: [movement]});
    }
    return result;
  }, [movements, period]);

  const emptyInPeriod = period !== undefined && movements.length > 0;

  return (
    <View className="gap-2">
      <Group className="gap-3">
        <View className="flex-row items-baseline justify-between px-4 pt-4">
          <Text className="text-xl font-satoshi-medium">
            {t('home:transactions.title')}
          </Text>

          {groups.length > 0 && (
            <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-50">
              <Text className="text-accent dark:text-teal-400">{t('common:actions.seeAll')}</Text>
            </Pressable>
          )}
        </View>

        {groups.length === 0 ? (
          <View className="items-center gap-1 px-4 pb-8 pt-4">
            <Text className="font-satoshi-medium text-xl">
              {emptyInPeriod
                ? t('home:transactions.emptyPeriod', {
                    period: t(`home:overview.periods.${period}`).toLowerCase(),
                  })
                : t('home:transactions.emptyTitle')}
            </Text>

            {!emptyInPeriod && (
              <Text className="text-center text-secundary text-lg">
                {t('home:transactions.emptyBody')}
              </Text>
            )}
          </View>
        ) : (
          <View className="gap-3 pb-3">
            {groups.map((group) => (
              <View key={group.title} className="gap-1">
                <Text className="px-4 text-sm text-secundary">{group.title}</Text>

                {group.movements.map((movement) => (
                  <TransactionRow key={movement.id} movement={movement} showDate={false} />
                ))}
              </View>
            ))}
          </View>
        )}
      </Group>
    </View>
  );
};
