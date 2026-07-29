import {Pressable, View} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

const SEGMENT_WIDTH = 88;

type SwitchOptionProps<T extends string> = {
  value: T;
  label: string;
};

type SwitchProps<T extends string> = {
  value: T;
  options: SwitchOptionProps<T>[];
  onChange: (value: T) => void;
};

export function Switch<T extends string>({value, options, onChange}: SwitchProps<T>) {
  const activeIndex = options.findIndex((option) => option.value === value);

  const indicator = useAnimatedStyle(
    () => ({
      transform: [
        {translateX: withSpring(activeIndex * SEGMENT_WIDTH, {damping: 50, stiffness: 280})},
      ],
    }),
    [activeIndex],
  );

  return (
    <View className="flex-row rounded-full p-1 bg-secundary">
      <Animated.View
        className="absolute bottom-1 left-1 top-1 rounded-full bg-tertiary"
        style={[{width: SEGMENT_WIDTH}, indicator]}
      />
      {options.map((option) => {
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
                active ? 'font-satoshi-bold' : 'font-satoshi-medium text-secundary',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
