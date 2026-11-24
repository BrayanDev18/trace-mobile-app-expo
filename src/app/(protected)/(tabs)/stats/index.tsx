import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Screen, Text} from '@/components';
import {
  CategoryBreakdown,
  CycleSelector,
  CycleTrend,
  StatTiles,
  SubscriptionsRow,
  useCycleStats,
} from '@/features/stats';

export default function StatsScreen() {
  const {t} = useTranslation();
  const [offset, setOffset] = useState(0);
  const stats = useCycleStats(offset);

  return (
    <Screen canGoBack={false}>
      <View className="px-5 pb-2 pt-3">
        <Text className="font-satoshi-bold text-2xl tracking-tight">{t('stats:title')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 20}}
      >
        {stats.cycle ? (
          <CycleSelector
            cycle={stats.cycle}
            isCurrent={offset === 0}
            onShift={(delta) => setOffset((current) => Math.min(0, current + delta))}
          />
        ) : (
          <Text className="px-1 font-satoshi-bold text-lg">{t('stats:period.allTime')}</Text>
        )}

        <StatTiles income={stats.income} expense={stats.expense} balance={stats.balance} />

        {stats.trend.length > 0 && <CycleTrend points={stats.trend} />}

        <CategoryBreakdown
          items={stats.categories}
          emptyLabel={t(stats.cycle ? 'stats:categories.emptyCycle' : 'stats:categories.emptyAll')}
        />

        <SubscriptionsRow />
      </ScrollView>
    </Screen>
  );
}
