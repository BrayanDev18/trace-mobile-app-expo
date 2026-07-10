import {ReactNode, useMemo, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {FadeIn} from 'react-native-reanimated';

import {Group, Header, Keypad, Screen, Separator, Text} from '@/components';
import {Colors} from '@/constants';
import {debtPaid, useDebtsStore, type DebtPayment} from '@/store/debts';
import {appendAmountKey, cn, displayAmount, formatCurrency, longDate, relativeDate} from '@/utils';

const isIOS = process.env.EXPO_OS === 'ios';
const select = () => {
  if (isIOS) Haptics.selectionAsync();
};
const tap = () => {
  if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const Row = ({label, children}: {label: string; children: ReactNode}) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text>{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);

export default function DebtDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();

  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);
  const addPayment = useDebtsStore((s) => s.addPayment);
  const removePayment = useDebtsStore((s) => s.removePayment);
  const settleDebt = useDebtsStore((s) => s.settleDebt);

  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');

  const debt = debts.find((d) => d.id === id);
  const debtPayments = useMemo(
    () => payments.filter((p) => p.debtId === id),
    [payments, id],
  );

  if (!debt) return null;

  const isLent = debt.direction === 'lent';
  const tint = isLent ? Colors.up : Colors.down;
  const initial = debt.person.trim().charAt(0).toUpperCase();
  const paid = debtPaid(payments, debt.id);
  const remaining = Math.max(0, debt.amount - paid);

  const remainingDisplay = formatCurrency(remaining);
  const remainingSize =
    remainingDisplay.length > 9 ? 'text-4xl' : remainingDisplay.length > 6 ? 'text-5xl' : 'text-6xl';

  const validAmount = Number(amount) > 0 && Number(amount) <= remaining;

  const onKey = (key: string) => {
    const next = appendAmountKey(amount, key);
    if (next === amount) return;
    tap();
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

  const cancelAdding = () => {
    select();
    setAmount('');
    setAdding(false);
  };

  const confirmPayment = () => {
    if (!validAmount) return;
    addPayment({
      id: `${Date.now()}`,
      debtId: debt.id,
      amount: Number(amount),
      date: new Date().toISOString(),
    });
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount('');
    setAdding(false);
  };

  const confirmRemove = (payment: DebtPayment) => {
    Alert.alert(
      '¿Eliminar abono?',
      `Se sumarán $${formatCurrency(payment.amount)} de vuelta al saldo pendiente.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removePayment(payment.id),
        },
      ],
    );
  };

  const confirmSettle = () => {
    Alert.alert(
      '¿Marcar como saldada?',
      remaining > 0
        ? `Aún quedan $${formatCurrency(remaining)} pendientes. Se moverá fuera de tus deudas activas.`
        : 'Se moverá fuera de tus deudas activas; su historial se conserva.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Saldar',
          onPress: () => {
            if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            settleDebt(debt.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen scroll>
      <Header title="Deuda" />

      <View className="items-center gap-4 px-6 pb-8 pt-6">
        <View
          className="h-14 w-14 items-center justify-center rounded-xl"
          style={{backgroundColor: `${tint}1f`}}
        >
          <Text className="font-satoshi-bold text-xl" style={{color: tint}}>
            {initial}
          </Text>
        </View>

        <View className="items-center gap-1">
          <Text numberOfLines={1} className="text-center font-satoshi-medium">
            {isLent ? `${debt.person} te debe` : `Le debes a ${debt.person}`}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            className={cn('font-satoshi-bold tracking-tight', remainingSize)}
            style={{fontVariant: ['tabular-nums']}}
          >
            ${remainingDisplay}
          </Text>
          {paid > 0 && (
            <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
              Abonado ${formatCurrency(paid)} de ${formatCurrency(debt.amount)}
            </Text>
          )}
        </View>
      </View>

      <View className="gap-8 px-5 pb-10">
        {adding ? (
          <Animated.View
            entering={FadeIn.duration(150)}
            className="gap-4 rounded-3xl bg-secundary p-4"
          >
            <View className="flex-row items-end justify-center gap-1 pt-2">
              <Text className={cn('pb-1 font-satoshi-medium text-xl', !amount && 'text-secundary')}>
                $
              </Text>
              <Text
                numberOfLines={1}
                className={cn(
                  'font-satoshi-bold text-4xl tracking-tight',
                  !amount && 'text-secundary',
                )}
                style={{fontVariant: ['tabular-nums']}}
              >
                {displayAmount(amount)}
              </Text>
            </View>

            <Keypad onKey={onKey} onErase={erase} onClear={clearAmount} />

            <View className="flex-row gap-3">
              <Pressable
                onPress={cancelAdding}
                className="h-14 flex-1 items-center justify-center rounded-full bg-tertiary active:opacity-70"
              >
                <Text className="font-satoshi-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={confirmPayment}
                disabled={!validAmount}
                className={cn(
                  'h-14 flex-1 items-center justify-center rounded-full bg-accent active:bg-accent-pressed',
                  !validAmount && 'opacity-40',
                )}
              >
                <Text className="font-satoshi-bold text-white">Abonar</Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <Pressable
            onPress={() => {
              select();
              setAdding(true);
            }}
            disabled={remaining === 0}
            className={cn(
              'h-14 items-center justify-center rounded-full bg-accent active:bg-accent-pressed',
              remaining === 0 && 'opacity-40',
            )}
          >
            <Text className="font-satoshi-bold text-white">
              {isLent ? 'Registrar abono' : 'Abonar'}
            </Text>
          </Pressable>
        )}

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Detalles</Text>
          <Group>
            <Row label="Monto original">
              <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                $ {formatCurrency(debt.amount)}
              </Text>
            </Row>
            <Separator />
            <Row label="Registrada">
              <Text className="text-secundary">{longDate(new Date(debt.createdAt))}</Text>
            </Row>
            <Separator />
            <Row label="Fecha acordada">
              <Text className="text-secundary">
                {debt.dueDate ? longDate(new Date(debt.dueDate)) : 'Sin fecha'}
              </Text>
            </Row>
          </Group>
        </View>

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Abonos</Text>
          <Group>
            {debtPayments.length === 0 ? (
              <View className="min-h-14 items-center justify-center px-4 py-3">
                <Text className="text-secundary">Sin abonos todavía</Text>
              </View>
            ) : (
              debtPayments.map((payment, index) => (
                <View key={payment.id}>
                  {index > 0 && <Separator />}
                  <Pressable
                    onLongPress={() => confirmRemove(payment)}
                    className="min-h-14 flex-row items-center justify-between px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
                  >
                    <Text>{relativeDate(new Date(payment.date))}</Text>
                    <Text
                      className="text-accent dark:text-teal-400"
                      style={{fontVariant: ['tabular-nums']}}
                    >
                      +${formatCurrency(payment.amount)}
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </Group>
          {debtPayments.length > 0 && (
            <Text className="px-4 text-xs text-secundary">
              Mantén presionado un abono para eliminarlo.
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Group>
            <Pressable
              onPress={confirmSettle}
              className="min-h-14 items-center justify-center px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <Text className="text-accent dark:text-teal-400">Marcar como saldada</Text>
            </Pressable>
          </Group>
          <Text className="px-4 text-xs text-secundary">
            Dejará de aparecer en tus deudas activas; su historial se conserva.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
