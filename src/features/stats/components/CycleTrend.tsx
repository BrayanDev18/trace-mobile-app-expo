import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {cn} from '@/utils';

import {type TrendPointProps} from '../hooks/useCycleStats';

type CycleTrendProps = {
  points: TrendPointProps[];
};

export const CycleTrend = ({points}: CycleTrendProps) => {
  const {t} = useTranslation();
  const max = Math.max(...points.map((p) => p.expense), 1);

  return (
    <View
      accessibilityLabel={t('stats:trend.a11y', {count: points.length})}
      className="gap-4 rounded-2xl bg-secundary p-4"
    >
      <Text className="font-satoshi-medium">{t('stats:trend.title', {count: points.length})}</Text>

      <View className="gap-2">
        <View className="h-28 flex-row items-end gap-2">
          {points.map((point, i) => (
            <View
              key={point.id}
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
            <Text key={point.id} numberOfLines={1} className="flex-1 text-center text-xs text-secundary">
              {point.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};
