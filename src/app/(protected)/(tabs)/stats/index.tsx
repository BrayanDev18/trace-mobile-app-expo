import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Screen, Text} from '@/components';
import {navigate} from '@/constants';
import {TransactionsList} from '@/features/home';
import {
  CategoryBreakdown,
  MonthSelector,
  MonthTrend,
  StatTiles,
  SubscriptionsRow,
  useMonthlyStats,
} from '@/features/stats';

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const goMovements = () => navigate('movements');

export default function StatsScreen() {
  const {t} = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const stats = useMonthlyStats(month);

  return (
    <Screen edges={['top']} canGoBack={false}>
      <View className="px-5 pb-2 pt-3">
        <Text className="font-satoshi-bold text-2xl tracking-tight">{t('stats:title')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 20}}
      >
        <MonthSelector month={month} onChange={setMonth} />

        <StatTiles income={stats.income} expense={stats.expense} balance={stats.balance} />

        <MonthTrend points={stats.trend} />

        <CategoryBreakdown items={stats.categories} />

        <SubscriptionsRow />

        <TransactionsList onSeeAll={goMovements} />
      </ScrollView>
    </Screen>
  );
}
