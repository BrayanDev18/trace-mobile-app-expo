import {useAnimatedStyle, useSharedValue, withSequence, withTiming} from 'react-native-reanimated';

import {appendAmountKey, haptic} from '@/utils';

type UseAmountInputOptionsProps = {
  getValue: () => string;
  onChange: (raw: string) => void;
};

export const useAmountInput = ({getValue, onChange}: UseAmountInputOptionsProps) => {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.get()}, {translateX: shake.get()}],
  }));

  const onKey = (key: string) => {
    const current = getValue();
    const next = appendAmountKey(current, key);
    if (next === current) return;
    haptic.tap();
    scale.set(withSequence(withTiming(1.04, {duration: 70}), withTiming(1, {duration: 110})));
    onChange(next);
  };

  const erase = () => {
    const current = getValue();
    if (!current) return;
    haptic.tap();
    onChange(current.slice(0, -1));
  };

  const clear = () => {
    if (!getValue()) return;
    haptic.tap();
    onChange('');
  };

  const shakeError = () => {
    shake.set(
      withSequence(
        withTiming(-7, {duration: 50}),
        withTiming(7, {duration: 50}),
        withTiming(-4, {duration: 50}),
        withTiming(0, {duration: 50}),
      ),
    );
  };

  return {animatedStyle, onKey, erase, clear, shakeError};
};
