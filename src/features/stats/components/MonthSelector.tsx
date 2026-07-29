import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';
import {capitalize, cn, haptic, monthsLong} from '@/utils';

type MonthSelectorProps = {
  month: Date;
  onChange: (month: Date) => void;
};

export const MonthSelector = ({month, onChange}: MonthSelectorProps) => {
  const {t} = useTranslation();
  const {primary} = useIconColors();

  const now = new Date();
  const isCurrent =
    month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const label = `${capitalize(monthsLong()[month.getMonth()])}${
    month.getFullYear() !== now.getFullYear() ? ` ${month.getFullYear()}` : ''
  }`;

  const shift = (delta: number) => {
    haptic.select();
    onChange(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  };

  return (
    <View className="flex-row items-center justify-between px-1">
      <Pressable
        accessibilityLabel={t('stats:month.previous')}
        onPress={() => shift(-1)}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-200 dark:active:bg-white/5"
      >
        <IconChevronLeft size={20} color={primary} />
      </Pressable>

      <Text className="font-satoshi-bold text-lg">{label}</Text>

      <Pressable
        accessibilityLabel={t('stats:month.next')}
        onPress={() => shift(1)}
        disabled={isCurrent}
        hitSlop={8}
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full active:bg-neutral-200 dark:active:bg-white/5',
          isCurrent && 'opacity-40',
        )}
      >
        <IconChevronRight size={20} color={primary} />
      </Pressable>
    </View>
  );
};
