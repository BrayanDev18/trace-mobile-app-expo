import {ReactNode, useState} from 'react';
import {Pressable, TextInput, View, useColorScheme} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  IconAlignLeft,
  IconCalendarEvent,
  IconCreditCard,
  IconPaperclip,
  IconTag,
  IconX,
} from '@tabler/icons-react-native';

import {Keypad, MonthCalendar, Screen, SheetModal, Text} from '@/components';
import {CATEGORIES, getCategory, getPaymentMethod, PAYMENT_METHODS} from '@/constants';
import {TypeSwitch} from '@/screens/expenses';
import {useMovementsStore} from '@/store/movements';
import {appendAmountKey, cn, displayAmount, relativeDate} from '@/utils';

const schema = z.object({
  type: z.enum(['expense', 'income']),
  reason: z.string().trim().min(1, 'Ingresa una razón'),
  amount: z.string().min(1, 'Ingresa un monto').refine((v) => Number(v) > 0, 'Monto inválido'),
  date: z.date(),
  categoryId: z.string().min(1, 'Elige una categoría'),
  method: z.string().optional(),
  receiptUri: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const isIOS = process.env.EXPO_OS === 'ios';
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};

const Chip = ({
  onPress,
  className,
  style,
  children,
}: {
  onPress: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => (
  <Pressable
    onPress={onPress}
    className={cn(
      'h-10 flex-row items-center gap-1.5 rounded-full bg-neutral-200 px-4 active:opacity-70 dark:bg-white/5',
      className,
    )}
    style={style}
  >
    {children}
  </Pressable>
);

export default function NewExpenseScreen() {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const faint = scheme === 'dark' ? '#525252' : '#a3a3a3';
  const iconColor = scheme === 'dark' ? '#ffffff' : '#000000';

  const [dateOpen, setDateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const addMovement = useMovementsStore((s) => s.add);

  const {control, handleSubmit, setValue, getValues, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      reason: '',
      amount: '',
      date: new Date(),
      categoryId: '',
      method: undefined,
      receiptUri: undefined,
    },
  });

  const [type, amount, date, categoryId, methodId, receiptUri] = useWatch({
    control,
    name: ['type', 'amount', 'date', 'categoryId', 'method', 'receiptUri'],
  });

  const category = categoryId ? getCategory(categoryId) : null;
  const CategoryIcon = category?.icon;
  const method = methodId ? getPaymentMethod(methodId) : undefined;

  const scale = useSharedValue(1);
  const shake = useSharedValue(0);
  const amountStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.get()}, {translateX: shake.get()}],
  }));

  const appendKey = (key: string) => {
    const current = getValues('amount');
    const next = appendAmountKey(current, key);
    if (next === current) return;
    tap();
    scale.set(withSequence(withTiming(1.04, {duration: 70}), withTiming(1, {duration: 110})));
    setValue('amount', next, {shouldValidate: attempted});
  };

  const erase = () => {
    const current = getValues('amount');
    if (!current) return;
    tap();
    setValue('amount', current.slice(0, -1), {shouldValidate: attempted});
  };

  const clearAmount = () => {
    tap();
    setValue('amount', '', {shouldValidate: attempted});
  };

  const pickReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality: 0.7});
    if (!result.canceled) {
      setValue('receiptUri', result.assets[0].uri);
      setReceiptOpen(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    addMovement({
      id: `${Date.now()}`,
      type: data.type,
      reason: data.reason,
      amount: Number(data.amount),
      date: data.date.toISOString(),
      categoryId: data.categoryId,
      methodId: data.method,
      receiptUri: data.receiptUri,
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const onInvalid = (errs: typeof errors) => {
    setAttempted(true);
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (errs.amount) {
      shake.set(
        withSequence(
          withTiming(-7, {duration: 50}),
          withTiming(7, {duration: 50}),
          withTiming(-4, {duration: 50}),
          withTiming(0, {duration: 50}),
        ),
      );
    }
  };

  const hasAmount = amount !== '';
  const display = displayAmount(amount);
  const amountSize = display.length > 9 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';
  const amountError = attempted && !!errors.amount;
  const reasonError = attempted && !!errors.reason;
  const categoryError = attempted && !!errors.categoryId;

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
        >
          <IconX size={18} color={iconColor} />
        </Pressable>

        <TypeSwitch
          value={type}
          onChange={(t) => {
            select();
            setValue('type', t);
          }}
        />

        <Pressable
          accessibilityLabel="Factura"
          onPress={() => (receiptUri ? setReceiptOpen(true) : pickReceipt())}
          className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
        >
          {receiptUri ? (
            <Image source={{uri: receiptUri}} style={{width: 40, height: 40}} contentFit="cover" />
          ) : (
            <IconPaperclip size={18} color={iconColor} />
          )}
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center gap-8">
        <View className="w-full flex-row items-center justify-center">
          <Animated.View style={amountStyle} className="max-w-[72%] flex-row items-end gap-1.5">
            <Text
              className={cn(
                'pb-2 font-satoshi-medium text-3xl',
                amountError
                  ? 'text-red-400 dark:text-red-400'
                  : !hasAmount
                    ? 'text-neutral-400 dark:text-neutral-600'
                    : type === 'income'
                      ? 'text-accent dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-600',
              )}
            >
              $
            </Text>
            <Text
              numberOfLines={1}
              className={cn(
                'font-satoshi-bold tracking-tight',
                amountSize,
                amountError
                  ? 'text-red-400 dark:text-red-400'
                  : hasAmount
                    ? 'text-primary'
                    : 'text-neutral-400 dark:text-neutral-600',
              )}
              style={{fontVariant: ['tabular-nums']}}
            >
              {display}
            </Text>
          </Animated.View>
        </View>

        <Controller
          control={control}
          name="reason"
          render={({field: {value, onChange, onBlur}}) => (
            <View
              className={cn(
                'flex-row items-center gap-2 h-14 rounded-full border bg-secundary px-5',
                reasonError ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-800',
              )}
            >
              <IconAlignLeft size={15} color={faint} />
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={type === 'expense' ? '¿En qué fue?' : '¿De dónde vino?'}
                placeholderTextColor={faint}
                returnKeyType="done"
                className="min-w-36 max-w-52 h-full font-satoshi-medium text-primary"
              />
            </View>
          )}
        />
      </View>

      <View
        className="rounded-t-[28px] bg-secundary px-4 pt-8 gap-8"
        style={{
          paddingBottom: insets.bottom + 10,
        }}
      >
        <View className="flex-row flex-wrap justify-center gap-3">
          <Chip onPress={() => setDateOpen(true)}>
            <IconCalendarEvent size={15} color={muted} />
            <Text className="font-satoshi-medium text-sm text-primary">
              {relativeDate(date)}
            </Text>
          </Chip>

          <Chip
            onPress={() => setCategoryOpen(true)}
            className={cn(categoryError && 'border border-red-400')}
            style={category ? {backgroundColor: `${category.tint}1f`} : undefined}
          >
            {category && CategoryIcon ? (
              <>
                <CategoryIcon size={15} color={category.tint} />
                <Text className="font-satoshi-bold text-sm" style={{color: category.tint}}>
                  {category.label}
                </Text>
              </>
            ) : (
              <>
                <IconTag size={15} color={muted} />
                <Text className="font-satoshi-medium text-sm text-secundary">
                  Categoría
                </Text>
              </>
            )}
          </Chip>

          <Chip onPress={() => setMethodOpen(true)}>
            {method ? (
              <>
                <method.Icon size={16} />
                <Text className="font-satoshi-medium text-sm text-primary">
                  {method.label}
                </Text>
              </>
            ) : (
              <>
                <IconCreditCard size={15} color={muted} />
                <Text className="font-satoshi-medium text-sm text-secundary">
                  Método
                </Text>
              </>
            )}
          </Chip>
        </View>

        <Keypad onKey={appendKey} onErase={erase} onClear={clearAmount} />

        <Pressable
          onPress={() => handleSubmit(onSubmit, onInvalid)()}
          className="h-14 items-center justify-center rounded-full bg-accent active:bg-accent-pressed"
        >
          <Text className="font-satoshi-bold text-base text-white">
            {type === 'income' ? 'Agregar ingreso' : 'Agregar gasto'}
          </Text>
        </Pressable>
      </View>

      <SheetModal visible={dateOpen} onClose={() => setDateOpen(false)} title="Fecha">
        <MonthCalendar
          selected={date}
          onSelect={(d) => {
            select();
            setValue('date', d);
            setDateOpen(false);
          }}
        />
      </SheetModal>

      <SheetModal visible={categoryOpen} onClose={() => setCategoryOpen(false)} title="Categoría">
        <View className="flex-row flex-wrap gap-2 pb-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const selected = categoryId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  select();
                  setValue('categoryId', c.id, {shouldValidate: true});
                  setCategoryOpen(false);
                }}
                className={cn(
                  'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70',
                  !selected && 'border-neutral-200 bg-secundary dark:border-neutral-800',
                )}
                style={selected ? {backgroundColor: `${c.tint}1f`, borderColor: `${c.tint}66`} : undefined}
              >
                <Icon size={16} color={c.tint} />
                <Text className="font-satoshi-medium text-sm text-primary">
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SheetModal>

      <SheetModal visible={methodOpen} onClose={() => setMethodOpen(false)} title="Método de pago">
        <View className="flex-row flex-wrap gap-2 pb-2">
          {PAYMENT_METHODS.map((m) => {
            const selected = methodId === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  select();
                  setValue('method', m.id);
                  setMethodOpen(false);
                }}
                className={cn(
                  'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70',
                  selected
                    ? 'border-accent bg-accent/10'
                    : 'border-neutral-200 bg-secundary dark:border-neutral-800',
                )}
              >
                <m.Icon size={18} />
                <Text className="font-satoshi-medium text-sm text-primary">
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SheetModal>

      <SheetModal visible={receiptOpen} onClose={() => setReceiptOpen(false)} title="Factura">
        {receiptUri ? (
          <Image
            source={{uri: receiptUri}}
            style={{width: '100%', height: 280, borderRadius: 20}}
            contentFit="cover"
          />
        ) : null}
        <View className="flex-row gap-3">
          <Pressable
            onPress={pickReceipt}
            className="flex-1 items-center rounded-2xl border border-neutral-200 py-3.5 active:opacity-70 dark:border-neutral-800"
          >
            <Text className="font-satoshi-medium text-sm text-primary">Cambiar</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setValue('receiptUri', undefined);
              setReceiptOpen(false);
            }}
            className="flex-1 items-center rounded-2xl bg-red-500/10 py-3.5 active:opacity-70"
          >
            <Text className="font-satoshi-medium text-sm text-red-500 dark:text-red-400">Quitar</Text>
          </Pressable>
        </View>
      </SheetModal>
    </Screen>
  );
}
