import {Pressable, View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {ScreenRoutes} from '@/constants';
import {cn, formatCurrency, shortDate} from '@/utils';

import {useCycleOverview} from '../hooks/useCycleOverview';

const DAY_MS = 86_400_000;

export const CycleCard = () => {
  const {t} = useTranslation();
  const overview = useCycleOverview();

  if (!overview) return null;

  const {cycle, daysLeft, income, committed, spent, available, ratio} = overview;
  const rangeLabel = `${shortDate(cycle.start)} – ${shortDate(new Date(cycle.end.getTime() - DAY_MS))}`;
  const over = available !== null && available < 0;

  return (
    <View className="gap-4 rounded-2xl bg-secundary p-4">
      <View className="flex-row items-baseline justify-between gap-3">
        <Text className="font-satoshi-medium">{t('income:cycle.title')}</Text>
        <Text className="text-xs text-secundary">
          {rangeLabel} · {t('income:cycle.daysLeft', {count: daysLeft})}
        </Text>
      </View>

      {income === null || available === null ? (
        <Pressable
          onPress={() => router.push(ScreenRoutes.incomeSetup)}
          className="gap-3 active:opacity-70"
        >
          <View className="flex-row gap-6">
            <CycleStat label={t('income:cycle.spent')} value={spent} />
            <CycleStat label={t('income:cycle.committed')} value={committed} />
          </View>

          <Text className="text-xs text-accent dark:text-teal-400">
            {t('income:cycle.setAmount')}
          </Text>
        </Pressable>
      ) : (
        <View className="gap-4">
          <View className="gap-0.5">
            <Text className="text-xs text-secundary">{t('income:cycle.available')}</Text>
            <Text
              numberOfLines={1}
              className={cn(
                'font-satoshi-bold text-3xl tracking-tight',
                over ? 'text-red-400' : 'text-accent dark:text-teal-400',
              )}
              style={{fontVariant: ['tabular-nums']}}
            >
              {over ? '-' : ''}${formatCurrency(Math.abs(available))}
            </Text>
          </View>

          <View className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/5">
            <View
              className={cn('h-full rounded-full', over ? 'bg-red-400' : 'bg-accent')}
              style={{width: `${(ratio ?? 0) * 100}%`}}
            />
          </View>

          <View className="flex-row gap-6">
            <CycleStat label={t('income:cycle.income')} value={income} />
            <CycleStat label={t('income:cycle.committed')} value={committed} />
            <CycleStat label={t('income:cycle.spent')} value={spent} />
          </View>
        </View>
      )}
    </View>
  );
};

const CycleStat = ({label, value}: {label: string; value: number}) => (
  <View className="gap-0.5">
    <Text className="text-xs text-secundary">{label}</Text>
    <Text
      numberOfLines={1}
      className="font-satoshi-medium text-sm"
      style={{fontVariant: ['tabular-nums']}}
    >
      ${formatCurrency(value)}
    </Text>
  </View>
);