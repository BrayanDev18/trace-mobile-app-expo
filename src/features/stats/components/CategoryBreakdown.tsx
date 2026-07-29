import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {formatCurrency} from '@/utils';

import {type CategoryTotalProps} from '../hooks/useMonthlyStats';

type CategoryBreakdownProps = {
  items: CategoryTotalProps[];
};

export const CategoryBreakdown = ({items}: CategoryBreakdownProps) => {
  const {t} = useTranslation();

  return (
    <View className="gap-4 rounded-2xl bg-secundary p-4">
      <Text className="font-satoshi-medium">{t('stats:categories.title')}</Text>

      {items.length === 0 ? (
        <Text className="py-4 text-center text-secundary">{t('stats:categories.empty')}</Text>
      ) : (
        <View className="gap-4">
          {items.map((item) => (
            <CategoryRow key={item.id} item={item} />
          ))}
        </View>
      )}
    </View>
  );
};

const CategoryRow = ({item}: {item: CategoryTotalProps}) => {
  const Icon = item.icon;

  return (
    <View className="flex-row items-center gap-3">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{backgroundColor: `${item.tint}1f`}}
      >
        <Icon size={18} color={item.tint} />
      </View>

      <View className="flex-1 gap-1.5">
        <View className="flex-row items-baseline justify-between gap-3">
          <Text numberOfLines={1} className="flex-1 font-satoshi-medium">
            {item.label}
          </Text>

          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            ${formatCurrency(item.total)}
          </Text>
        </View>

        <View className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/5">
          <View
            className="h-full rounded-full"
            style={{width: `${item.share * 100}%`, backgroundColor: item.tint}}
          />
        </View>
      </View>
    </View>
  );
};