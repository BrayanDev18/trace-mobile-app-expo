import {ScrollView} from 'react-native';
import {navigate} from '@/constants';
import {
  BalanceCardSkia,
  HomeHeader,
  QuickActions,
  TransactionsList,
  useHomeBalance,
} from '@/features/home';
import {CycleProposalCard, CycleSummarySheet, useCycleProposal} from '@/features/income';
import {useSessionStore} from '@/store/session';
import {isOwner} from '@/utils';
import {Screen} from '@/components';

const goMovements = () => navigate('movements');

export default function HomeScreen() {
  const name = useSessionStore((s) => s.user?.name.split(' ')[0]);
  const owner = useSessionStore((s) => isOwner(s.user?.email));
  const overview = useHomeBalance();
  const proposal = useCycleProposal();

  return (
    <Screen canGoBack={false}>
      <HomeHeader name={name} isOwner={owner}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 20}}
      >
        <BalanceCardSkia overview={overview} palette="esmeralda"/>

        {proposal.detected && (
          <CycleProposalCard
            cycle={proposal.detected}
            onAccept={proposal.accept}
            onDismiss={proposal.dismiss}
          />
        )}

        <QuickActions/>

        <TransactionsList onSeeAll={goMovements}/>
      </ScrollView>

      <CycleSummarySheet/>
    </Screen>
  );
}
