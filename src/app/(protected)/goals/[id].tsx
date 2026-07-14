import {useMemo} from 'react';
import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';

import {Header, Screen,DetailBadge, DetailHero,GroupAction} from '@/components';
import {DetailRows, type DetailRow,HistoryList, type HistoryItem} from '@/components';
import {AmountEntryToggle} from '@/components/capture';
import {ProgressBar, getGoalTheme, goalProgress,useGoalsStore} from '@/features/goals';
import {formatCurrency, longDate,confirmDestructive} from '@/utils';

export default function GoalDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();

  const goals = useGoalsStore((s) => s.goals);
  const contributions = useGoalsStore((s) => s.contributions);
  const addContribution = useGoalsStore((s) => s.addContribution);
  const removeContribution = useGoalsStore((s) => s.removeContribution);
  const archiveGoal = useGoalsStore((s) => s.archiveGoal);

  const goal = goals.find((g) => g.id === id);
  const goalContributions = useMemo(
    () => contributions.filter((c) => c.goalId === id),
    [contributions, id],
  );

  if (!goal) return null;

  const theme = getGoalTheme(goal.themeId);
  const ThemeIcon = theme.icon;
  const {saved, progress, percent, monthly} = goalProgress(goal, contributions);

  const rows: DetailRow[] = [
    {label: 'Objetivo', value: `$ ${formatCurrency(goal.targetAmount)}`, tabular: true},
    {
      label: 'Fecha límite',
      value: goal.deadline ? longDate(new Date(goal.deadline)) : 'Sin fecha',
    },
  ];
  if (monthly !== null) {
    rows.push({label: 'Ritmo para llegar', value: `$ ${formatCurrency(monthly)}/mes`, tabular: true});
  }

  const confirmContribution = (value: number) =>
    addContribution({goalId: goal.id, amount: value});

  const removeConfirm = (contribution: HistoryItem) =>
    confirmDestructive({
      title: '¿Eliminar aporte?',
      message: `Se restarán $${formatCurrency(contribution.amount)} del progreso.`,
      actionLabel: 'Eliminar',
      onConfirm: () => removeContribution(contribution.id),
    });

  const archiveConfirm = () =>
    confirmDestructive({
      title: '¿Archivar meta?',
      message: 'Dejará de aparecer en tus metas activas; su historial se conserva.',
      actionLabel: 'Archivar',
      onConfirm: () => {
        archiveGoal(goal.id);
        router.back();
      },
    });

  return (
    <Screen edges={['top']} scroll>
      <Header title="Meta" />

      <DetailHero
        badge={
          <DetailBadge tint={theme.tint}>
            <ThemeIcon size={25} color={theme.tint} />
          </DetailBadge>
        }
        title={goal.name}
        amount={saved}
        meta={`${percent}% de $${formatCurrency(goal.targetAmount)}`}
      >
        <ProgressBar progress={progress} className="w-full" />
      </DetailHero>

      <View className="gap-8 px-5 pb-10">
        <AmountEntryToggle
          ctaLabel="Aportar"
          confirmLabel="Aportar"
          onConfirm={confirmContribution}
        />

        <DetailRows title="Detalles" rows={rows} />

        <HistoryList
          title="Aportes"
          items={goalContributions}
          emptyLabel="Sin aportes todavía"
          hint="Mantén presionado un aporte para eliminarlo."
          onRemove={removeConfirm}
        />

        <GroupAction
          destructive
          label="Archivar meta"
          caption="Dejará de aparecer en tus metas activas; su historial se conserva."
          onPress={archiveConfirm}
        />
      </View>
    </Screen>
  );
}
