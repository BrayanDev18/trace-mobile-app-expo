import {ScrollView} from 'react-native';

import {Screen} from '@/components';
import {navigate} from '@/constants';
import {
  BalanceCardSkia,
  HomeHeader,
  QuickActions,
  TransactionsList,
  useBalanceOverview,
} from '@/features/home';
import {useSessionStore} from '@/store/session';
import {isOwner} from '@/utils';

const goMovements = () => navigate('movements');

export default function HomeScreen() {
  const name = useSessionStore((s) => s.user?.name.split(' ')[0]);
  const owner = useSessionStore((s) => isOwner(s.user?.email));
  const {overviews, current, setPeriod} = useBalanceOverview();

  return (
    <Screen edges={['top']} asBackground={false} canGoBack={false}>
      <HomeHeader name={name} isOwner={owner} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 20}}
      >
        <BalanceCardSkia
          overviews={overviews}
          current={current}
          onSelectPeriod={setPeriod}
          palette="esmeralda"
        />

        <QuickActions />

        <TransactionsList period={current.period} onSeeAll={goMovements} />
      </ScrollView>
    </Screen>
  );
}
