import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {Header, Screen,EmptyState,ListGap,SectionTitle} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {GoalCard, GoalsOverview} from '@/features/goals';
import {goalSaved, useGoalsStore, type Goal} from '@/features/goals';

type Row = {goal: Goal; saved: number};

const LIST_CONTENT = {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24};
const keyExtractor = ({goal}: Row) => goal.id;
const goNewGoal = () => router.push(ScreenRoutes.newGoal);

const GoalsScreen = () => {
  const goals = useGoalsStore((s) => s.goals);
  const contributions = useGoalsStore((s) => s.contributions);

  const active = useMemo(
    () =>
      goals
        .filter((g) => !g.archivedAt)
        .map((goal) => ({goal, saved: goalSaved(contributions, goal.id)})),
    [goals, contributions],
  );

  const totals = useMemo(
    () =>
      active.reduce(
        (acc, {goal, saved}) => ({
          saved: acc.saved + saved,
          target: acc.target + goal.targetAmount,
        }),
        {saved: 0, target: 0},
      ),
    [active],
  );

  const renderItem = useCallback<ListRenderItem<Row>>(
    ({item}) => (
      <GoalCard
        goal={item.goal}
        saved={item.saved}
        onPress={() => router.push(DynamicRoutes.goal(item.goal.id))}
      />
    ),
    [],
  );

  return (
    <Screen>
      <Header title="Metas" />

      <View className="flex-1">
        <FlashList
          data={active}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={LIST_CONTENT}
          ItemSeparatorComponent={ListGap}
          ListHeaderComponent={
            active.length > 0 ? (
              <View className="gap-6 pb-3">
                <GoalsOverview
                  saved={totals.saved}
                  target={totals.target}
                  count={active.length}
                  onAdd={goNewGoal}
                />
                <SectionTitle>Mis metas</SectionTitle>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="Sin metas todavía"
              subtitle="Aún no tienes fijada ninguna meta"
              actionLabel="Nueva meta"
              onAction={goNewGoal}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default GoalsScreen;