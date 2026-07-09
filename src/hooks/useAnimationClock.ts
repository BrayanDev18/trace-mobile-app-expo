import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from 'expo-router';
import {useFrameCallback, useSharedValue, type SharedValue} from 'react-native-reanimated';

/**
 * Reloj para animaciones Skia continuas. A diferencia de useClock, avanza
 * como máximo a `fps` (menos redibujados = menos GPU/batería) y se detiene
 * cuando la pantalla pierde el foco o `enabled` es false.
 */
export const useAnimationClock = (fps = 30, enabled = true): SharedValue<number> => {
  const clock = useSharedValue(0);
  const acc = useSharedValue(0);
  const [focused, setFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const frame = useFrameCallback((info) => {
    acc.value += info.timeSincePreviousFrame ?? 0;
    if (acc.value >= 1000 / fps) {
      clock.value += acc.value;
      acc.value = 0;
    }
  }, false);

  const active = enabled && focused;

  useEffect(() => {
    frame.setActive(active);
  }, [frame, active]);

  return clock;
};
