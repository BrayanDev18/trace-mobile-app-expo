import {ScrollView} from 'react-native';

import {Screen} from '@/components';
import {BalanceCardSkia, HomeHeader, QuickActions, TransactionsList} from '@/screens/home';

export default function HomeScreen() {
  return (
    <Screen edges={['top']}>
      <HomeHeader/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 20}}
      >
        <BalanceCardSkia
          overviews={[
            {label: 'Daily overview', value: 280000},
            {label: 'Monthly overview', value: 780000},
          ]}
          income={450000}
          expense={170000}
          palette="esmeralda"
        />

        <QuickActions />

        <TransactionsList/>
      </ScrollView>
    </Screen>
  );
}
