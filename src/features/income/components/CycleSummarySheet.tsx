import {Pressable, View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconChevronRight} from '@tabler/icons-react-native';

import {Button, SheetModal, Text} from '@/components';
import {ScreenRoutes} from '@/constants';
import {getSavingTheme, type SavingProps} from '@/features/savings';
import {useIconColors} from '@/hooks/useIconColors';
import {cn, formatCurrency, shortDate} from '@/utils';

import {useCycleSummary, type SummaryCategoryProps} from '../hooks/useCycleSummary';

const DAY_MS = 86_400_000;

export const CycleSummarySheet = () => {
  const {t} = useTranslation();
  const {summary, savings, moveLeftover, dismiss} = useCycleSummary();

  if (!summary) return null;

  const {cycle, spent, received, leftover, top, previousSpent} = summary;
  const rangeLabel = `${shortDate(cycle.start)} – ${shortDate(new Date(cycle.end.getTime() - DAY_MS))}`;
  const overspent = leftover !== null && leftover < 0;

  const delta = spent - previousSpent;
  const comparison =
    delta === 0
      ? t('income:summary.sameAsPrevious')
      : t(delta < 0 ? 'income:summary.lessThanPrevious' : 'income:summary.moreThanPrevious', {
          amount: `$${formatCurrency(Math.abs(delta))}`,
        });

  const goToSavings = () => {
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

          {previousSpent > 0 ? (
            <Text className="font-satoshi-medium text-sm text-secundary">{comparison}</Text>
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
          <LeftoverAction
            amount={leftover}
            savings={savings}
            onMove={moveLeftover}
            onCreate={goToSavings}
          />
        ) : null}

        <Pressable onPress={dismiss} hitSlop={8} className="items-center active:opacity-50">
          <Text className="font-satoshi-medium text-secundary">{t('income:summary.close')}</Text>
        </Pressable>
      </View>
    </SheetModal>
  );
};

type LeftoverActionProps = {
  amount: number;
  savings: SavingProps[];
  onMove: (savingId: string) => void;
  onCreate: () => void;
};

const LeftoverAction = (props: LeftoverActionProps) => {
  const {amount, savings, onMove, onCreate} = props;
  const {t} = useTranslation();
  const label = `$${formatCurrency(amount)}`;

  if (savings.length === 0) {
    return <Button label={t('income:summary.createSaving')} onPress={onCreate} />;
  }

  if (savings.length === 1) {
    return (
      <Button
        label={t('income:summary.moveTo', {amount: label, name: savings[0].name})}
        onPress={() => onMove(savings[0].id)}
      />
    );
  }

  return (
    <View className="gap-2">
      <Text className="font-satoshi-medium">{t('income:summary.movePick', {amount: label})}</Text>

      {savings.map((saving) => (
        <SavingRow key={saving.id} saving={saving} onPress={() => onMove(saving.id)} />
      ))}
    </View>
  );
};

const SavingRow = ({saving, onPress}: {saving: SavingProps; onPress: () => void}) => {
  const theme = getSavingTheme(saving.themeId);
  const Icon = theme.icon;
  const {faint} = useIconColors();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl px-2 py-2 active:bg-neutral-200 dark:active:bg-white/5"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{backgroundColor: `${theme.tint}1f`}}
      >
        <Icon size={17} color={theme.tint} />
      </View>

      <Text numberOfLines={1} className="flex-1 font-satoshi-medium">
        {saving.name}
      </Text>

      <IconChevronRight size={16} color={faint} />
    </Pressable>
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
