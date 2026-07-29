import {Pressable, View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {Button, SheetModal, Text} from '@/components';
import {ScreenRoutes} from '@/constants';
import {cn, formatCurrency, shortDate} from '@/utils';

import {useCycleSummary, type SummaryCategoryProps} from '../hooks/useCycleSummary';

const DAY_MS = 86_400_000;

export const CycleSummarySheet = () => {
  const {t} = useTranslation();
  const {summary, dismiss} = useCycleSummary();

  if (!summary) return null;

  const {cycle, spent, received, leftover, top} = summary;
  const rangeLabel = `${shortDate(cycle.start)} – ${shortDate(new Date(cycle.end.getTime() - DAY_MS))}`;
  const overspent = leftover !== null && leftover < 0;

  const toSavings = () => {
    dismiss();
    router.push(ScreenRoutes.savings);
  };

  return (
    <SheetModal visible onClose={dismiss} title={t('income:summary.title')}>
      <View className="gap-5">
        <Text className="text-xs text-secundary">{rangeLabel}</Text>

        <View className="gap-3">
          {received !== null ? (
            <SummaryRow label={t('income:summary.received')} value={received} />
          ) : null}

          <SummaryRow label={t('income:summary.spent')} value={spent} />

          {leftover !== null ? (
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="text-secundary">
                {t(overspent ? 'income:summary.overspent' : 'income:summary.leftover')}
              </Text>
              <Text
                numberOfLines={1}
                className={cn(
                  'font-satoshi-bold text-lg',
                  overspent ? 'text-red-400' : 'text-accent dark:text-teal-400',
                )}
                style={{fontVariant: ['tabular-nums']}}
              >
                {overspent ? '-' : ''}${formatCurrency(Math.abs(leftover))}
              </Text>
            </View>
          ) : null}
        </View>

        {top.length > 0 ? (
          <View className="gap-3">
            <Text className="font-satoshi-medium">{t('income:summary.topTitle')}</Text>
            {top.map((item) => (
              <TopCategoryRow key={item.categoryId} item={item} />
            ))}
          </View>
        ) : null}

        {leftover !== null && leftover > 0 ? (
          <Button label={t('income:summary.toSavings')} onPress={toSavings} />
        ) : null}

        <Pressable onPress={dismiss} hitSlop={8} className="items-center active:opacity-50">
          <Text className="font-satoshi-medium text-secundary">{t('income:summary.close')}</Text>
        </Pressable>
      </View>
    </SheetModal>
  );
};

const SummaryRow = ({label, value}: {label: string; value: number}) => (
  <View className="flex-row items-baseline justify-between gap-3">
    <Text className="text-secundary">{label}</Text>
    <Text
      numberOfLines={1}
      className="font-satoshi-medium"
      style={{fontVariant: ['tabular-nums']}}
    >
      ${formatCurrency(value)}
    </Text>
  </View>
);

const TopCategoryRow = ({item}: {item: SummaryCategoryProps}) => {
  const Icon = item.icon;

  return (
    <View className="flex-row items-center gap-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{backgroundColor: `${item.tint}1f`}}
      >
        <Icon size={17} color={item.tint} />
      </View>

      <Text numberOfLines={1} className="flex-1 font-satoshi-medium">
        {item.label}
      </Text>

      <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
        ${formatCurrency(item.total)}
      </Text>
    </View>
  );
};
