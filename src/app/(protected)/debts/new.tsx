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
import {IconCalendarEvent, IconUser, IconX} from '@tabler/icons-react-native';

import {Chip, Input, Keypad, MonthCalendar, Screen, Text} from '@/components';
import {useDebtsStore, type DebtDirection} from '@/store/debts';
import {appendAmountKey, cn, displayAmount, shortDate} from '@/utils';

/** Modo de entrada activo en el panel inferior: el keypad o un picker en su lugar. */
type Panel = 'keypad' | 'date';

const PANEL_HEIGHT = 330;

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const DIRECTIONS: {value: DebtDirection; label: string}[] = [
  {value: 'lent', label: 'Me deben'},
  {value: 'owed', label: 'Yo debo'},
];

export default function NewDebtScreen() {
  const scheme = useColorScheme();
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const iconColor = scheme === 'dark' ? '#ffffff' : '#000000';
  const insets = useSafeAreaInsets();

  const addDebt = useDebtsStore((s) => s.addDebt);

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<DebtDirection>('lent');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [panel, setPanel] = useState<Panel>('keypad');

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
  const valid = person.trim().length > 0 && Number(amount) > 0;

  const submit = () => {
    if (!valid) return;
    addDebt({
      id: `${Date.now()}`,
      direction,
      person: person.trim(),
      amount: Number(amount),
      dueDate: dueDate?.toISOString(),
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
        <Text className="font-satoshi-bold">Nueva deuda</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconUser}
            defaultValue={person}
            onChangeText={setPerson}
            placeholder="¿Con quién? (Ana, Carlos…)"
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
            {DIRECTIONS.map((option) => {
              const active = direction === option.value;
              return (
                <Chip
                  key={option.value}
                  onPress={() => {
                    select();
                    setDirection(option.value);
                  }}
                  className={cn(active && 'bg-accent!')}
                >
                  <Text className={cn(active && 'font-satoshi-medium')}>{option.label}</Text>
                </Chip>
              );
            })}

            <Chip
              onPress={() => togglePanel('date')}
              className={cn(panel === 'date' && 'bg-accent!')}
            >
              <IconCalendarEvent size={15} color={muted} />
              <Text className="font-satoshi-medium text-secundary">
                {dueDate ? shortDate(dueDate) : 'Sin fecha'}
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
                  selected={dueDate ?? new Date()}
                  onSelect={(d) => {
                    select();
                    setDueDate(d);
                    setPanel('keypad');
                  }}
                />
              </Animated.View>
            )}
          </View>

          <Pressable
            onPress={submit}
            disabled={!valid}
            className={cn(
              'h-14 items-center justify-center rounded-full bg-accent active:bg-accent-pressed',
              !valid && 'opacity-40',
            )}
          >
            <Text className="font-satoshi-bold text-white">Registrar deuda</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
