import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {type CycleRangeProps} from '@/features/income';
import {useIconColors} from '@/hooks/useIconColors';
import {cn, haptic, shortDate} from '@/utils';

type CycleSelectorProps = {
  cycle: CycleRangeProps;
  isCurrent: boolean;
  onShift: (delta: number) => void;
};

export const CycleSelector = ({cycle, isCurrent, onShift}: CycleSelectorProps) => {
  const {t} = useTranslation();
  const {primary} = useIconColors();

  const label = t('stats:cycle.range', {
    from: shortDate(cycle.start),
    to: shortDate(new Date(cycle.end.getTime() - 1)),
  });

  const shift = (delta: number) => {
    haptic.select();
    onShift(delta);
  };

  return (
    <View className="flex-row items-center justify-between px-1">
      <Pressable
        accessibilityLabel={t('stats:cycle.previous')}
        onPress={() => shift(-1)}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-200 dark:active:bg-white/5"
      >
        <IconChevronLeft size={20} color={primary} />
      </Pressable>

      <Text numberOfLines={1} className="font-satoshi-bold text-lg">
        {label}
      </Text>

      <Pressable
        accessibilityLabel={t('stats:cycle.next')}
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
