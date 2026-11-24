import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {cn, formatCurrency, shortDate} from '@/utils';

import type {CycleRecapProps} from '../types';

const DAY_MS = 86_400_000;

export const CycleRecapRow = ({recap}: {recap: CycleRecapProps}) => {
  const {t} = useTranslation();
  const {cycle, spent, leftover} = recap;

  const overspent = leftover !== null && leftover < 0;
  const range = `${shortDate(cycle.start)} – ${shortDate(new Date(cycle.end.getTime() - DAY_MS))}`;

  return (
    <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1} className="font-satoshi-medium">
          {range}
        </Text>

        <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
          {t('income:history.spent', {amount: `$${formatCurrency(spent)}`})}
        </Text>
      </View>

      {leftover !== null ? (
        <Text
          numberOfLines={1}
          className={cn(
            'font-satoshi-bold',
            overspent ? 'text-red-400' : 'text-accent dark:text-teal-400',
          )}
          style={{fontVariant: ['tabular-nums']}}
        >
          {overspent ? '-' : '+'}${formatCurrency(Math.abs(leftover))}
        </Text>
      ) : null}
    </View>
  );
};
