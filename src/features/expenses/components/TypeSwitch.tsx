import {Pressable, View} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

import {Text} from '@/components';
import {cn} from '@/utils';

import {type MovementTypeProps} from '../types';

const SEGMENT_WIDTH = 88;

const OPTIONS: { value: MovementTypeProps; label: string }[] = [
  {value: 'expense', label: 'Gasto'},
  {value: 'income', label: 'Ingreso'},
];

type TypeSwitchProps = {
  value: MovementTypeProps;
  onChange: (value: MovementTypeProps) => void;
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
    <View className="flex-row rounded-full p-1 bg-secundary">
      <Animated.View
        className="absolute bottom-1 left-1 top-1 rounded-full bg-tertiary"
        style={[{width: SEGMENT_WIDTH}, indicator]}
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
};
