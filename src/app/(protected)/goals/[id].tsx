import {ReactNode, useMemo, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {FadeIn} from 'react-native-reanimated';

import {Group, Header, Keypad, Screen, Separator, Text} from '@/components';
import {ProgressBar, getGoalTheme, monthsUntil} from '@/screens/goals';
import {goalSaved, useGoalsStore, type GoalContribution} from '@/store/goals';
import {appendAmountKey, cn, displayAmount, formatCurrency, longDate, relativeDate} from '@/utils';

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const Row = ({label, children}: {label: string; children: ReactNode}) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text>{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);

export default function GoalDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();

  const goals = useGoalsStore((s) => s.goals);
  const contributions = useGoalsStore((s) => s.contributions);
  const addContribution = useGoalsStore((s) => s.addContribution);
  const removeContribution = useGoalsStore((s) => s.removeContribution);
  const archiveGoal = useGoalsStore((s) => s.archiveGoal);

  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');

  const goal = goals.find((g) => g.id === id);
  const goalContributions = useMemo(
    () => contributions.filter((c) => c.goalId === id),
    [contributions, id],
  );

  if (!goal) return null;

  const theme = getGoalTheme(goal.themeId);
  const ThemeIcon = theme.icon;
  const saved = goalSaved(contributions, goal.id);
  const progress = goal.targetAmount > 0 ? saved / goal.targetAmount : 0;
  const percent = Math.min(100, Math.round(progress * 100));
  const remaining = Math.max(0, goal.targetAmount - saved);
  const months = goal.deadline ? monthsUntil(goal.deadline) : null;
  const monthly = months !== null && remaining > 0 ? remaining / Math.max(1, months) : null;

  const savedDisplay = formatCurrency(saved);
  const savedSize =
    savedDisplay.length > 9 ? 'text-4xl' : savedDisplay.length > 6 ? 'text-5xl' : 'text-6xl';

  const validAmount = Number(amount) > 0;

  const onKey = (key: string) => {
    const next = appendAmountKey(amount, key);
    if (next === amount) return;
    tap();
    setAmount(next);
  };

  const erase = () => {
    if (!amount) return;
    tap();
    setAmount(amount.slice(0, -1));
  };

  const clearAmount = () => {
    tap();
    setAmount('');
  };

  const cancelAdding = () => {
    select();
    setAmount('');
    setAdding(false);
  };

  const confirmContribution = () => {
    if (!validAmount) return;
    addContribution({
      id: `${Date.now()}`,
      goalId: goal.id,
      amount: Number(amount),
      date: new Date().toISOString(),
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount('');
    setAdding(false);
  };

  const confirmRemove = (contribution: GoalContribution) => {
    Alert.alert(
      '¿Eliminar aporte?',
      `Se restarán $${formatCurrency(contribution.amount)} del progreso.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeContribution(contribution.id),
        },
      ],
    );
  };

  const confirmArchive = () => {
    Alert.alert('¿Archivar meta?', 'Dejará de aparecer en tus metas activas; su historial se conserva.', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Archivar',
        onPress: () => {
          if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          archiveGoal(goal.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title="Meta" />

      <View className="items-center gap-4 px-6 pb-8 pt-6">
        <View
          className="h-14 w-14 items-center justify-center rounded-xl"
          style={{backgroundColor: `${theme.tint}1f`}}
        >
          <ThemeIcon size={25} color={theme.tint} />
        </View>

        <View className="items-center gap-1">
          <Text numberOfLines={2} className="text-center font-satoshi-medium">
            {goal.name}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            className={cn('font-satoshi-bold tracking-tight', savedSize)}
            style={{fontVariant: ['tabular-nums']}}
          >
            ${savedDisplay}
          </Text>
          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            {percent}% de ${formatCurrency(goal.targetAmount)}
          </Text>
        </View>

        <ProgressBar progress={progress} className="w-full" />
      </View>

      <View className="gap-8 px-5 pb-10">
        {adding ? (
          <Animated.View
            entering={FadeIn.duration(150)}
            className="gap-4 rounded-3xl bg-secundary p-4"
          >
            <View className="flex-row items-end justify-center gap-1 pt-2">
              <Text className={cn('pb-1 font-satoshi-medium text-xl', !amount && 'text-secundary')}>
                $
              </Text>
              <Text
                numberOfLines={1}
                className={cn(
                  'font-satoshi-bold text-4xl tracking-tight',
                  !amount && 'text-secundary',
                )}
                style={{fontVariant: ['tabular-nums']}}
              >
                {displayAmount(amount)}
              </Text>
            </View>

            <Keypad onKey={onKey} onErase={erase} onClear={clearAmount} />

            <View className="flex-row gap-3">
              <Pressable
                onPress={cancelAdding}
                className="h-14 flex-1 items-center justify-center rounded-full bg-tertiary active:opacity-70"
              >
                <Text className="font-satoshi-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={confirmContribution}
                disabled={!validAmount}
                className={cn(
                  'h-14 flex-1 items-center justify-center rounded-full bg-accent active:bg-accent-pressed',
                  !validAmount && 'opacity-40',
                )}
              >
                <Text className="font-satoshi-bold text-white">Aportar</Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <Pressable
            onPress={() => {
              select();
              setAdding(true);
            }}
            className="h-14 items-center justify-center rounded-full bg-accent active:bg-accent-pressed"
          >
            <Text className="font-satoshi-bold text-white">Aportar</Text>
          </Pressable>
        )}

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Detalles</Text>
          <Group>
            <Row label="Objetivo">
              <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                $ {formatCurrency(goal.targetAmount)}
              </Text>
            </Row>
            <Separator />
            <Row label="Fecha límite">
              <Text className="text-secundary">
                {goal.deadline ? longDate(new Date(goal.deadline)) : 'Sin fecha'}
              </Text>
            </Row>
            {monthly !== null && (
              <>
                <Separator />
                <Row label="Ritmo para llegar">
                  <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                    $ {formatCurrency(monthly)}/mes
                  </Text>
                </Row>
              </>
            )}
          </Group>
        </View>

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Aportes</Text>
          <Group>
            {goalContributions.length === 0 ? (
              <View className="min-h-14 items-center justify-center px-4 py-3">
                <Text className="text-secundary">Sin aportes todavía</Text>
              </View>
            ) : (
              goalContributions.map((contribution, index) => (
                <View key={contribution.id}>
                  {index > 0 && <Separator />}
                  <Pressable
                    onLongPress={() => confirmRemove(contribution)}
                    className="min-h-14 flex-row items-center justify-between px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
                  >
                    <Text>{relativeDate(new Date(contribution.date))}</Text>
                    <Text
                      className="text-accent dark:text-teal-400"
                      style={{fontVariant: ['tabular-nums']}}
                    >
                      +${formatCurrency(contribution.amount)}
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </Group>

          {goalContributions.length > 0 && (
            <Text className="px-4 text-xs text-secundary">
              Mantén presionado un aporte para eliminarlo.
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Group>
            <Pressable
              onPress={confirmArchive}
              className="min-h-14 items-center justify-center px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <Text className="text-red-400">Archivar meta</Text>
            </Pressable>
          </Group>
          <Text className="px-4 text-xs text-secundary">
            Dejará de aparecer en tus metas activas; su historial se conserva.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
