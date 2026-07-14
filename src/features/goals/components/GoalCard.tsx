import {memo} from 'react';
import {Pressable, View} from 'react-native';

import {Text} from '@/components';
import type {GoalProps} from '../types';
import {formatCurrency} from '@/utils';

import {monthsUntil} from '../utils';
import {getGoalTheme} from '../themes';
import {ProgressBar} from './ProgressBar';

type GoalCardProps = {
  goal: GoalProps;
  saved: number;
  onPress?: () => void;
};

export const GoalCard = memo(function GoalCard({goal, saved, onPress}: GoalCardProps) {
  const theme = getGoalTheme(goal.themeId);
  const ThemeIcon = theme.icon;
  const progress = goal.targetAmount > 0 ? saved / goal.targetAmount : 0;
  const percent = Math.min(100, Math.round(progress * 100));
  const months = goal.deadline ? monthsUntil(goal.deadline) : null;

  return (
    <Pressable
      onPress={onPress}
      className="gap-4 rounded-2xl bg-secundary p-4 active:opacity-70"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-xl"
          style={{backgroundColor: `${theme.tint}1f`}}
        >
          <ThemeIcon size={22} color={theme.tint} />
        </View>

        <View className="flex-1">
          <Text numberOfLines={1} className="font-satoshi-medium text-[16px]">
            {goal.name}
          </Text>
          {months !== null && (
            <Text className="text-sm text-secundary">
              {months === 0 ? 'Vence este mes' : `Faltan ${months} ${months === 1 ? 'mes' : 'meses'}`}
            </Text>
          )}
        </View>

        <Text className="font-satoshi-bold" style={{fontVariant: ['tabular-nums']}}>
          {percent}%
        </Text>
      </View>

      <ProgressBar progress={progress} />

      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
          $ {formatCurrency(saved)}
        </Text>
        <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
          de $ {formatCurrency(goal.targetAmount)}
        </Text>
      </View>
    </Pressable>
  );
});