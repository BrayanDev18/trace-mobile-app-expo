import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {cn} from '@/utils';

import {type MonthPointProps} from '../hooks/useMonthlyStats';

type MonthTrendProps = {
  points: MonthPointProps[];
};

export const MonthTrend = ({points}: MonthTrendProps) => {
  const {t} = useTranslation();
  const max = Math.max(...points.map((p) => p.expense), 1);

  return (
    <View
      accessibilityLabel={t('stats:trend.a11y', {months: points.length})}
      className="gap-4 rounded-2xl bg-secundary p-4"
    >
      <Text className="font-satoshi-medium">{t('stats:trend.title', {months: points.length})}</Text>

      <View className="gap-2">
        <View className="h-28 flex-row items-end gap-2">
          {points.map((point, i) => (
            <View
              key={point.label}
              className={cn(
                'flex-1 rounded-t-md',
                i === points.length - 1 ? 'bg-red-400' : 'bg-red-400/30',
              )}
              style={{height: `${Math.max((point.expense / max) * 100, 2)}%`}}
            />
          ))}
        </View>

        <View className="flex-row gap-2">
          {points.map((point) => (
            <Text key={point.label} className="flex-1 text-center text-xs text-secundary">
              {point.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};