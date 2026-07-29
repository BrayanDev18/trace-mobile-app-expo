import {memo} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {formatCurrency} from '@/utils';

import type {SavingProps} from '../types';
import {monthsUntil} from '../utils';
import {getSavingTheme} from '../themes';
import {ProgressBar} from './ProgressBar';

type SavingCardProps = {
  saving: SavingProps;
  saved: number;
  onPress?: () => void;
};

export const SavingCard = memo(function SavingCard({saving, saved, onPress}: SavingCardProps) {
  const {t} = useTranslation();
  const theme = getSavingTheme(saving.themeId);
  const ThemeIcon = theme.icon;
  const target = saving.targetAmount ?? 0;
  const hasTarget = target > 0;
  const progress = hasTarget ? saved / target : 0;
  const percent = Math.min(100, Math.round(progress * 100));
  const months = saving.deadline ? monthsUntil(saving.deadline) : null;

  return (
    <Pressable onPress={onPress} className="gap-4 rounded-2xl bg-secundary p-4 active:opacity-70">
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-xl"
          style={{backgroundColor: `${theme.tint}1f`}}
        >
          <ThemeIcon size={22} color={theme.tint} />
        </View>

        <View className="flex-1">
          <Text numberOfLines={1} className="font-satoshi-medium text-[16px]">
            {saving.name}
          </Text>
          {(months !== null || !hasTarget) && (
            <Text className="text-sm text-secundary">
              {months !== null
                ? months === 0
                  ? t('savings:card.dueThisMonth')
                  : t('savings:card.monthsLeft', {count: months})
                : t('savings:card.fund')}
            </Text>
          )}
        </View>

        {hasTarget && (
          <Text className="font-satoshi-bold" style={{fontVariant: ['tabular-nums']}}>
            {percent}%
          </Text>
        )}
      </View>

      {hasTarget && <ProgressBar progress={progress} />}

      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
          $ {formatCurrency(saved)}
        </Text>
        {hasTarget && (
          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            {t('savings:card.ofTarget', {amount: formatCurrency(target)})}
          </Text>
        )}
      </View>
    </Pressable>
  );
});