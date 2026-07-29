import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {cn, formatCurrency} from '@/utils';

type StatTilesProps = {
  income: number;
  expense: number;
  balance: number;
};

export const StatTiles = ({income, expense, balance}: StatTilesProps) => {
  const {t} = useTranslation();

  return (
    <View className="flex-row gap-3">
      <Tile label={t('stats:tiles.income')} value={income} tone="up" />
      <Tile label={t('stats:tiles.expense')} value={expense} tone="down" />
      <Tile label={t('stats:tiles.balance')} value={balance} />
    </View>
  );
};

type TileProps = {
  label: string;
  value: number;
  tone?: 'up' | 'down';
};

const Tile = ({label, value, tone}: TileProps) => (
  <View className="flex-1 gap-1 rounded-2xl bg-secundary p-3">
    <Text className="text-xs text-secundary">{label}</Text>

    <Text
      numberOfLines={1}
      className={cn(
        'font-satoshi-bold',
        tone === 'up' && 'text-accent dark:text-teal-400',
        tone === 'down' && 'text-red-400',
      )}
      style={{fontVariant: ['tabular-nums']}}
    >
      {value < 0 ? '-' : ''}${formatCurrency(Math.abs(value))}
    </Text>
  </View>
);