import {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {IconCalendarEvent, IconCreditCard, IconSearch, IconX} from '@tabler/icons-react-native';

import {Chip, Input, Keypad, MonthCalendar, Screen, Text} from '@/components';
import {PAYMENT_METHODS, getPaymentMethod} from '@/constants';
import {useBrandSearch, type BrandResult, type Subscription} from '@/screens/subscriptions';
import {useMovementsStore} from '@/store/movements';
import {useSubscriptionsStore} from '@/store/subscriptions';
import {appendAmountKey, cn, displayAmount} from '@/utils';
import {useSafeAreaInsets} from "react-native-safe-area-context";

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const shortDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

/** Modo de entrada activo en el panel inferior: el keypad o un picker en su lugar. */
type Panel = 'keypad' | 'date' | 'method';

const PANEL_HEIGHT = 330;

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const PERIODS: { value: Subscription['period']; label: string }[] = [
  {value: 'monthly', label: 'Mensual'},
  {value: 'yearly', label: 'Anual'},
];

export default function NewSubscriptionScreen() {
  const scheme = useColorScheme();
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const iconColor = scheme === 'dark' ? '#ffffff' : '#000000';

  const add = useSubscriptionsStore((s) => s.add);
  const addFirstCharge = useMovementsStore((s) => s.add);

  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState<BrandResult | null>(null);
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<Subscription['period']>('monthly');
  const [date, setDate] = useState(() => new Date());
  const [methodId, setMethodId] = useState<string | undefined>(undefined);
  const [panel, setPanel] = useState<Panel>('keypad');

  const togglePanel = (target: Panel) => {
    select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  const insets = useSafeAreaInsets();

  const {data, isFetching, error} = useBrandSearch(query);
  const method = methodId ? getPaymentMethod(methodId) : undefined;

  const pickBrand = (result: BrandResult) => {
    select();
    setBrand(result);
    setQuery('');
  };

  const scale = useSharedValue(1);
  const amountStyle = useAnimatedStyle(() => ({transform: [{scale: scale.get()}]}));

  const onKey = (key: string) => {
    const next = appendAmountKey(price, key);
    if (next === price) return;
    tap();
    scale.set(withSequence(withTiming(1.04, {duration: 70}), withTiming(1, {duration: 110})));
    setPrice(next);
  };

  const erase = () => {
    if (!price) return;
    tap();
    setPrice(price.slice(0, -1));
  };

  const clearPrice = () => {
    tap();
    setPrice('');
  };

  const display = displayAmount(price);
  const amountSize = display.length > 9 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';
  const valid = !!brand && Number(price) > 0;

  const submit = () => {
    if (!brand || !valid) return;
    const id = `${Date.now()}`;

    const next = new Date(date);
    if (period === 'yearly') next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);

    add({
      id,
      name: brand.name,
      category: brand.domain,
      logoUrl: brand.logo_url,
      price: Number(price),
      period,
      nextCharge: shortDate(next),
      methodId,
    });
    addFirstCharge({
      id: `${id}-1`,
      type: 'expense',
      reason: brand.name,
      amount: Number(price),
      date: date.toISOString(),
      categoryId: 'subscriptions',
      methodId,
      subscriptionId: id,
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <Screen edges={['top']} scroll={!brand} keyboard={!brand} asBackground={false}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <Pressable
          accessibilityLabel="Cerrar"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-12 w-12 items-center justify-center rounded-full active:opacity-70 bg-tertiary"
        >
          <IconX size={18} color={iconColor}/>
        </Pressable>
        <Text className="font-satoshi-bold">Nueva suscripcion</Text>
        <View className="h-10 w-10"/>
      </View>

      {!brand ? (
        <View className="gap-4 px-5 pt-4">
          <Input
            icon={IconSearch}
            defaultValue={query}
            onChangeText={setQuery}
            placeholder="Busca el servicio (Netflix, Spotify…)"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />

          {isFetching && <ActivityIndicator className="py-4"/>}

          {!!error && (
            <Text className="text-center text-sm text-red-400">
              No pudimos buscar. Revisa tu conexión e intenta de nuevo.
            </Text>
          )}

          {!isFetching && data?.length === 0 && query.trim().length >= 2 && (
            <Text className="text-center text-sm text-secundary">Sin resultados</Text>
          )}

          <View className="gap-1">
            {(data ?? []).map((result, index) => (
              <Pressable
                key={`${result.domain}-${index}`}
                onPress={() => pickBrand(result)}
                className="flex-row items-center gap-3 rounded-2xl px-3 py-2.5 active:bg-neutral-200 dark:active:bg-white/5"
              >
                <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-xl">
                  <Image
                    source={{uri: result.logo_url}}
                    style={{width: 38, height: 38, borderRadius: 9}}
                    contentFit="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-satoshi-medium">{result.name}</Text>
                  <Text className="text-sm text-secundary">{result.domain}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View className="flex-1 pt-4">
          <View className="px-5">
            <View className="flex-row items-center gap-3 rounded-2xl bg-secundary p-3">
              <View
                className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-950">
                <Image
                  source={{uri: brand.logo_url}}
                  style={{width: 42, height: 42, borderRadius: 10}}
                  contentFit="contain"
                />
              </View>

              <View className="flex-1">
                <Text className="font-satoshi-bold text-xl font">{brand.name}</Text>
                <Text className="text-secundary">{brand.domain}</Text>
              </View>

              <Pressable onPress={() => setBrand(null)} hitSlop={8}
                         className="active:opacity-50 bg-tertiary px-4 py-2 rounded-xl">
                <Text className="font-satoshi-medium">
                  Cambiar
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-1 items-center justify-center">
            <Animated.View style={amountStyle} className="flex-row items-end justify-center gap-1">
              <Text
                className={cn(
                  'pb-2 font-satoshi-medium text-3xl',
                  !price && 'text-secundary',
                )}
              >
                $
              </Text>
              <Text
                numberOfLines={1}
                className={cn(
                  'max-w-[65%] font-satoshi-bold tracking-tight',
                  amountSize,
                  !price && 'text-secundary',
                )}
                style={{fontVariant: ['tabular-nums']}}
              >
                {display}
              </Text>
              <Text className="pb-2 text-secundary">/{period === 'yearly' ? 'año' : 'mes'}</Text>
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
              {PERIODS.map((option) => {
                const active = period === option.value;
                return (
                  <Chip
                    key={option.value}
                    onPress={() => {
                      select();
                      setPeriod(option.value);
                    }}
                    className={cn(
                      active
                        ? 'btn-primary'
                        : 'bg-tertiary',
                    )}
                  >
                    <Text
                      className={cn(
                        active && 'font-satoshi-medium',
                      )}
                    >
                      {option.label}
                    </Text>
                  </Chip>
                );
              })}

              <Chip
                onPress={() => togglePanel('date')}
                className={cn(panel === 'date' && 'btn-primary')}
              >
                <IconCalendarEvent size={15} color={muted}/>
                <Text className="font-satoshi-medium text-secundary">
                  {shortDate(date)}
                </Text>
              </Chip>

              <Chip
                onPress={() => togglePanel('method')}
                className={cn(panel === 'method' && 'btn-primary')}
              >
                {method ? (
                  <>
                    <method.Icon size={16}/>
                    <Text className="font-satoshi-medium">{method.label}</Text>
                  </>
                ) : (
                  <>
                    <IconCreditCard size={15} color={muted}/>
                    <Text className="font-satoshi-medium">Método</Text>
                  </>
                )}
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
                  <Keypad onKey={onKey} onErase={erase} onClear={clearPrice}/>
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
                    selected={date}
                    onSelect={(d) => {
                      select();
                      setDate(d);
                      setPanel('keypad');
                    }}
                  />
                </Animated.View>
              )}

              {panel === 'method' && (
                <Animated.View
                  entering={FadeIn.duration(150)}
                  exiting={FadeOut.duration(120)}
                  style={StyleSheet.absoluteFill}
                  className="justify-center"
                >
                  <View className="flex-row flex-wrap justify-center gap-4">
                    {PAYMENT_METHODS.map((m) => {
                      const active = methodId === m.id;
                      return (
                        <Pressable
                          key={m.id}
                          onPress={() => {
                            select();
                            setMethodId(m.id);
                            setPanel('keypad');
                          }}
                          className={cn(
                            'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70 bg-neutral-100 dark:bg-neutral-800',
                            !active ? 'border-neutral-200 bg-secundary dark:border-neutral-800' : 'border-transparent',
                          )}
                        >
                          <m.Icon size={18}/>
                          <Text className="font-satoshi-medium">{m.label}</Text>
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
              <Text className="font-satoshi-bold text-white">Agregar suscripción</Text>
            </Pressable>
          </View>
        </View>
      )}

    </Screen>
  );
}
