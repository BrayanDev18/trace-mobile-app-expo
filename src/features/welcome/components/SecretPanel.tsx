import {useEffect, useRef} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {IconLock, IconLockOpen} from '@tabler/icons-react-native';

import {Button, Text} from '@/components';
import {useColorScheme} from '@/hooks/useColorScheme';
import {cn} from '@/utils';

import {SECRET_LENGTH} from '../utils';

type SecretPanelProps = {
  value: string;
  failures: number;
  onChangeText: (text: string) => void;
  onSubmit: () => void
};

export const SecretPanel = (props: SecretPanelProps) => {
  const {value, failures, onChangeText, onSubmit} = props;

  const {t} = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const shake = useSharedValue(0);
  const reduced = useReducedMotion();
  const accent = useColorScheme() === 'dark' ? '#00d5be' : '#009689';

  useEffect(() => {
    if (failures === 0 || reduced) return;

    shake.value = withSequence(
      withTiming(-7, {duration: 50}),
      withTiming(7, {duration: 50}),
      withTiming(-4, {duration: 50}),
      withTiming(0, {duration: 50}),
    );
  }, [failures, reduced, shake]);

  const shakeStyle = useAnimatedStyle(() => ({transform: [{translateX: shake.value}]}));

  const boxes = Array.from({length: SECRET_LENGTH}, (_, index) => value[index] ?? '');
  const activeIndex = Math.min(value.length, SECRET_LENGTH - 1);

  return (
    <View className="gap-8">
      <View className="items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
          <IconLock size={26} color={accent}/>
        </View>

        <View className="gap-2">
          <Text className="text-center font-satoshi-bold text-3xl tracking-tight">
            {t('welcome:locked.title')}
          </Text>
          <Text className="text-center text-lg text-secundary">{t('welcome:locked.subtitle')}</Text>
        </View>
      </View>

      <Animated.View style={shakeStyle}>
        <View className="flex-row gap-2">
          {boxes.map((letter, index) => (
            <View
              key={index}
              className={cn(
                'h-16 flex-1 items-center justify-center rounded-2xl bg-secundary',
                index === activeIndex && 'border-2 border-accent',
              )}
            >
              <Text className="font-satoshi-bold text-xl">{letter}</Text>
            </View>
          ))}
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          accessibilityLabel={t('welcome:locked.inputLabel')}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          caretHidden
          maxLength={SECRET_LENGTH}
          returnKeyType="go"
          style={[StyleSheet.absoluteFill, {opacity: 0}]}
        />
      </Animated.View>

      <View className="gap-4">
        <Button
          label={t('welcome:locked.action')}
          icon={IconLockOpen}
          onPress={onSubmit}
          className="active:bg-accent-pressed"
        />
      </View>
    </View>
  );
};
