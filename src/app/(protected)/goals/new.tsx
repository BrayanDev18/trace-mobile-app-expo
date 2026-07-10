import {useState} from 'react';
import {Pressable, StyleSheet, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import * as Haptics from 'expo-haptics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {IconCalendarEvent, IconTargetArrow, IconX} from '@tabler/icons-react-native';

import {Chip, Input, Keypad, MonthCalendar, Screen, Text} from '@/components';
import {GOAL_THEMES, getGoalTheme} from '@/screens/goals';
import {useGoalsStore} from '@/store/goals';
import {appendAmountKey, cn, displayAmount, shortDate} from '@/utils';

/** Modo de entrada activo en el panel inferior: el keypad o un picker en su lugar. */
type Panel = 'keypad' | 'date' | 'theme';

const PANEL_HEIGHT = 330;

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export default function NewGoalScreen() {
  const scheme = useColorScheme();
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const iconColor = scheme === 'dark' ? '#ffffff' : '#000000';
  const insets = useSafeAreaInsets();

  const addGoal = useGoalsStore((s) => s.addGoal);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [themeId, setThemeId] = useState('travel');
  const [panel, setPanel] = useState<Panel>('keypad');

  const theme = getGoalTheme(themeId);
  const ThemeIcon = theme.icon;

  const togglePanel = (target: Panel) => {
    select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  const scale = useSharedValue(1);
  const amountStyle = useAnimatedStyle(() => ({transform: [{scale: scale.get()}]}));

  const onKey = (key: string) => {
    const next = appendAmountKey(amount, key);
    if (next === amount) return;
    tap();
    scale.set(withSequence(withTiming(1.04, {duration: 70}), withTiming(1, {duration: 110})));
    setAmount(next);
  };

  const erase = () => {
    if (!amount) return;
    tap();
    setAmount(amount.slice(0, -1));
  };

  const clearAmount = () => {
    tap();
    setAmount('');
  };

  const display = displayAmount(amount);
  const amountSize = display.length > 9 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';
  const valid = name.trim().length > 0 && Number(amount) > 0;

  const submit = () => {
    if (!valid) return;
    addGoal({
      id: `${Date.now()}`,
      name: name.trim(),
      themeId,
      targetAmount: Number(amount),
      deadline: deadline?.toISOString(),
      createdAt: new Date().toISOString(),
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <Screen edges={['top']} asBackground={false}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <Pressable
          accessibilityLabel="Cerrar"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
        >
          <IconX size={18} color={iconColor} />
        </Pressable>
        <Text className="font-satoshi-bold">Nueva meta</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconTargetArrow}
            defaultValue={name}
            onChangeText={setName}
            placeholder="¿Para qué ahorras? (Viaje, iPhone…)"
          />
        </View>

        <View className="flex-1 items-center justify-center">
          <Animated.View style={amountStyle} className="flex-row items-end justify-center gap-1">
            <Text className={cn('pb-2 font-satoshi-medium text-3xl', !amount && 'text-secundary')}>
              $
            </Text>
            <Text
              numberOfLines={1}
              className={cn(
                'max-w-[65%] font-satoshi-bold tracking-tight',
                amountSize,
                !amount && 'text-secundary',
              )}
              style={{fontVariant: ['tabular-nums']}}
            >
              {display}
            </Text>
          </Animated.View>
        </View>

        <View
          className="gap-4 rounded-t-[28px] bg-secundary px-4 pt-8"
          style={{
            paddingBottom: insets.bottom + 10,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.04)',
          }}
        >
          <View className="flex-row flex-wrap justify-center gap-3">
            <Chip
              onPress={() => togglePanel('theme')}
              className={cn(panel === 'theme' && 'bg-accent!')}
            >
              <ThemeIcon size={16} color={theme.tint} />
              <Text className="font-satoshi-medium">{theme.label}</Text>
            </Chip>

            <Chip
              onPress={() => togglePanel('date')}
              className={cn(panel === 'date' && 'bg-accent!')}
            >
              <IconCalendarEvent size={15} color={muted} />
              <Text className="font-satoshi-medium text-secundary">
                {deadline ? shortDate(deadline) : 'Sin fecha'}
              </Text>
            </Chip>
          </View>

          <View style={{height: PANEL_HEIGHT}}>
            {panel === 'keypad' && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(120)}
                style={StyleSheet.absoluteFill}
                className="justify-center"
              >
                <Keypad onKey={onKey} onErase={erase} onClear={clearAmount} />
              </Animated.View>
            )}

            {panel === 'date' && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(120)}
                style={StyleSheet.absoluteFill}
                className="justify-center"
              >
                <MonthCalendar
                  selected={deadline ?? new Date()}
                  onSelect={(d) => {
                    select();
                    setDeadline(d);
                    setPanel('keypad');
                  }}
                />
              </Animated.View>
            )}

            {panel === 'theme' && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(120)}
                style={StyleSheet.absoluteFill}
                className="justify-center"
              >
                <View className="flex-row flex-wrap justify-center gap-4">
                  {GOAL_THEMES.map((t) => {
                    const Icon = t.icon;
                    const active = themeId === t.id;
                    return (
                      <Pressable
                        key={t.id}
                        onPress={() => {
                          select();
                          setThemeId(t.id);
                          setPanel('keypad');
                        }}
                        className={cn(
                          'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70 bg-neutral-100 dark:bg-neutral-800',
                          !active ? 'border-neutral-200 bg-secundary dark:border-neutral-800' : 'border-transparent',
                        )}
                        style={active ? {backgroundColor: `${t.tint}1f`} : undefined}
                      >
                        <Icon size={16} color={t.tint} />
                        <Text className="font-satoshi-medium">{t.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            )}
          </View>

          <Pressable
            onPress={submit}
            disabled={!valid}
            className={cn(
              'h-14 items-center justify-center rounded-full btn-primary',
              !valid && 'opacity-40',
            )}
          >
            <Text className="font-satoshi-bold">Crear meta</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
