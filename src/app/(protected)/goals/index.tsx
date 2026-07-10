import {useMemo} from 'react';
import {Pressable, useColorScheme, View} from 'react-native';
import {router} from 'expo-router';

import {Header, Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {GoalCard, GoalsOverview, getGoalTheme} from '@/screens/goals';
import {goalSaved, useGoalsStore} from '@/store/goals';
import {IconPlus} from "@tabler/icons-react-native";

const GoalsScreen = () => {
  const dark = useColorScheme() === 'dark';

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

  const segments = active.map(({goal, saved}) => ({
    id: goal.id,
    tint: getGoalTheme(goal.themeId).tint,
    saved,
  }));

  return (
    <Screen scroll>
      <Header title="Metas"/>

      <View className="gap-6 px-5 py-4">
        {active.length === 0 ? (
          <View className="items-center gap-3 py-12 w-full">
            <Text className="font-satoshi-medium text-xl">Sin metas todavía</Text>

            <Text className="text-center text-lg text-secundary">
              Aún no tienes fijada ninguna meta
            </Text>

            <Pressable
              onPress={() => router.push(ScreenRoutes.newGoal)}
              className="h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary w-full"
            >
              <IconPlus size={18} color={dark ? '#ffffff' : '#171717'}/>
              <Text className="font-satoshi-bold text-sm">Nueva meta</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <GoalsOverview
              saved={totals.saved}
              target={totals.target}
              count={active.length}
              segments={segments}
            />

            <View className="gap-3">
              <Text className="px-4 font-satoshi-medium text-lg">Mis metas</Text>

              <View className="gap-3">
                {active.map(({goal, saved}) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    saved={saved}
                    onPress={() => router.push(DynamicRoutes.goal(goal.id))}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </Screen>
  );
};

export default GoalsScreen;
