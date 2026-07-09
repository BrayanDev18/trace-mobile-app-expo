import {useState} from 'react';
import {ActivityIndicator, Pressable, TextInput, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {IconCalendarEvent, IconCreditCard, IconSearch, IconX} from '@tabler/icons-react-native';

import {Keypad, MonthCalendar, Screen, SheetModal, Text} from '@/components';
import {PAYMENT_METHODS, getPaymentMethod} from '@/constants';
import {useBrandSearch, type BrandResult, type Subscription} from '@/screens/subscriptions';
import {useSubscriptionsStore} from '@/store/subscriptions';
import {appendAmountKey, cn, displayAmount} from '@/utils';
import {useSafeAreaInsets} from "react-native-safe-area-context";

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const shortDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const PERIODS: {value: Subscription['period']; label: string}[] = [
  {value: 'monthly', label: 'Mensual'},
  {value: 'yearly', label: 'Anual'},
];

export default function NewSubscriptionScreen() {
  const scheme = useColorScheme();
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const faint = scheme === 'dark' ? '#525252' : '#a3a3a3';
  const iconColor = scheme === 'dark' ? '#ffffff' : '#000000';

  const add = useSubscriptionsStore((s) => s.add);

  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState<BrandResult | null>(null);
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<Subscription['period']>('monthly');
  const [date, setDate] = useState(() => new Date());
  const [methodId, setMethodId] = useState<string | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

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
    add({
      id: `${Date.now()}`,
      name: brand.name,
      category: brand.domain,
      logoUrl: brand.logo_url,
      price: Number(price),
      period,
      nextCharge: shortDate(date),
      methodId,
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <Screen edges={['top']} scroll={!brand} keyboard={!brand}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <Pressable
          accessibilityLabel="Cerrar"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
        >
          <IconX size={18} color={iconColor} />
        </Pressable>
        <Text className="font-satoshi-bold text-base text-primary">Nueva suscripción</Text>
        <View className="h-10 w-10" />
      </View>

      {!brand ? (
        <View className="gap-4 px-5 pt-4">
          <View className="flex-row items-center gap-2 rounded-full border border-neutral-200 bg-secundary px-5 dark:border-neutral-800">
            <IconSearch size={16} color={faint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Busca el servicio (Netflix, Spotify…)"
              placeholderTextColor={faint}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              className="flex-1 py-3 font-satoshi-medium text-base text-primary"
            />
          </View>

          {isFetching && <ActivityIndicator className="py-4" />}

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
              <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-950">
                <Image
                  source={{uri: brand.logo_url}}
                  style={{width: 42, height: 42, borderRadius: 10}}
                  contentFit="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="font-satoshi-bold text-[17px]">{brand.name}</Text>
                <Text className="text-sm text-secundary">{brand.domain}</Text>
              </View>
              <Pressable onPress={() => setBrand(null)} hitSlop={8} className="active:opacity-50">
                <Text className="font-satoshi-medium text-sm text-accent dark:text-emerald-400">
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
                  price ? 'text-primary' : 'text-neutral-400 dark:text-neutral-600',
                )}
              >
                $
              </Text>
              <Text
                numberOfLines={1}
                className={cn(
                  'max-w-[65%] font-satoshi-bold tracking-tight',
                  amountSize,
                  price ? 'text-primary' : 'text-neutral-400 dark:text-neutral-600',
                )}
                style={{fontVariant: ['tabular-nums']}}
              >
                {display}
              </Text>
              <Text className="pb-2 text-secundary">/{period === 'yearly' ? 'año' : 'mes'}</Text>
            </Animated.View>
          </View>

          <View
            className="gap-6 rounded-t-[28px] bg-secundary px-4 pt-8"
            style={{
              paddingBottom: insets.bottom + 10,
              boxShadow: '0 -4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <View className="flex-row flex-wrap justify-center gap-3">
              {PERIODS.map((option) => {
                const active = period === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      select();
                      setPeriod(option.value);
                    }}
                    className={cn(
                      'h-10 flex-row items-center rounded-full border px-5 active:opacity-70',
                      active
                        ? 'border-accent bg-accent/10'
                        : 'border-neutral-200 bg-secundary dark:border-neutral-800',
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm',
                        active
                          ? 'font-satoshi-bold text-accent dark:text-emerald-400'
                          : 'font-satoshi-medium text-secundary',
                      )}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => setDateOpen(true)}
                className="h-10 flex-row items-center gap-1.5 rounded-full bg-neutral-200 px-4 active:opacity-70 dark:bg-white/5"
              >
                <IconCalendarEvent size={15} color={muted} />
                <Text className="font-satoshi-medium text-sm text-primary">
                  {shortDate(date)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setMethodOpen(true)}
                className="h-10 flex-row items-center gap-1.5 rounded-full bg-neutral-200 px-4 active:opacity-70 dark:bg-white/5"
              >
                {method ? (
                  <>
                    <method.Icon size={16} />
                    <Text className="font-satoshi-medium text-sm text-primary">{method.label}</Text>
                  </>
                ) : (
                  <>
                    <IconCreditCard size={15} color={muted} />
                    <Text className="font-satoshi-medium text-sm text-secundary">Método</Text>
                  </>
                )}
              </Pressable>
            </View>

            <Keypad onKey={onKey} onErase={erase} onClear={clearPrice} />

            <Pressable
              onPress={submit}
              disabled={!valid}
              className={cn(
                'h-14 items-center justify-center rounded-full bg-accent active:bg-accent-pressed',
                !valid && 'opacity-40',
              )}
            >
              <Text className="font-satoshi-bold text-base text-white">Agregar suscripción</Text>
            </Pressable>
          </View>
        </View>
      )}

      <SheetModal visible={dateOpen} onClose={() => setDateOpen(false)} title="Próximo cobro">
        <MonthCalendar
          selected={date}
          onSelect={(d) => {
            select();
            setDate(d);
            setDateOpen(false);
          }}
        />
      </SheetModal>

      <SheetModal visible={methodOpen} onClose={() => setMethodOpen(false)} title="Método de pago">
        <View className="flex-row flex-wrap gap-2 pb-2">
          {PAYMENT_METHODS.map((m) => {
            const active = methodId === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  select();
                  setMethodId(m.id);
                  setMethodOpen(false);
                }}
                className={cn(
                  'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70',
                  active
                    ? 'border-accent bg-accent/10'
                    : 'border-neutral-200 bg-secundary dark:border-neutral-800',
                )}
              >
                <m.Icon size={18} />
                <Text className="font-satoshi-medium text-sm text-primary">{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SheetModal>
    </Screen>
  );
}
