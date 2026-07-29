import {Pressable, View} from 'react-native';

import {Text} from '@/components';
import {cn, haptic} from '@/utils';

type DayGridProps = {
  options: {value: number; label: string}[];
  value: number;
  onSelect: (value: number) => void;
};

export const DayGrid = ({options, value, onSelect}: DayGridProps) => (
  <View className="flex-row flex-wrap justify-center gap-2 px-2">
    {options.map((option) => {
      const active = option.value === value;

      return (
        <Pressable
          key={option.value}
          onPress={() => {
            haptic.select();
            onSelect(option.value);
          }}
          className={cn(
            'h-11 min-w-11 items-center justify-center rounded-full px-2 active:opacity-70',
            active ? 'btn-primary' : 'bg-tertiary',
          )}
        >
          <Text
            className={cn(
              'text-sm',
              active ? 'font-satoshi-bold text-white' : 'font-satoshi-medium',
            )}
            style={{fontVariant: ['tabular-nums']}}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);