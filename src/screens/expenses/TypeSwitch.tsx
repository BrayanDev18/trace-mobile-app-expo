import {Pressable, View} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

import {Text} from '@/components';
import {cn} from '@/utils';

export type MovementType = 'expense' | 'income';

const SEGMENT_WIDTH = 88;

const OPTIONS: {value: MovementType; label: string}[] = [
  {value: 'expense', label: 'Gasto'},
  {value: 'income', label: 'Ingreso'},
];

type TypeSwitchProps = {
  value: MovementType;
  onChange: (value: MovementType) => void;
};

export const TypeSwitch = ({value, onChange}: TypeSwitchProps) => {
  const indicator = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: withSpring(value === 'expense' ? 0 : SEGMENT_WIDTH, {
            damping: 50,
            stiffness: 280,
          }),
        },
      ],
    }),
    [value],
  );

  return (
    <View className="flex-row rounded-full bg-neutral-200 p-1 dark:bg-white/10">
      <Animated.View
        className="absolute bottom-1 left-1 top-1 rounded-full bg-white dark:bg-neutral-700"
        style={[{width: SEGMENT_WIDTH, boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}, indicator]}
      />
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{width: SEGMENT_WIDTH}}
            className="items-center justify-center py-2"
          >
            <Text
              className={cn(
                'text-sm',
                !active && 'font-satoshi-medium text-neutral-400 dark:text-neutral-600',
                active && option.value === 'expense' && 'font-satoshi-bold text-primary',
                active && option.value === 'income' && 'font-satoshi-bold text-accent dark:text-emerald-400',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
