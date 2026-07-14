import {useMemo} from 'react';
import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';

import {Header, Screen, Text,DetailBadge, DetailHero,DetailRows,GroupAction} from '@/components';
import {HistoryList, type HistoryItemProps} from '@/components';
import {AmountEntryToggle} from '@/components/capture';
import {Colors} from '@/constants';
import {debtPaid, useDebtsStore} from '@/features/debts';
import {formatCurrency, longDate,confirmDestructive} from '@/utils';

export default function DebtDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();

  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);
  const addPayment = useDebtsStore((s) => s.addPayment);
  const removePayment = useDebtsStore((s) => s.removePayment);
  const settleDebt = useDebtsStore((s) => s.settleDebt);

  const debt = debts.find((d) => d.id === id);
  const debtPayments = useMemo(() => payments.filter((p) => p.debtId === id), [payments, id]);

  if (!debt) return null;

  const isLent = debt.direction === 'lent';
  const tint = isLent ? Colors.up : Colors.down;
  const paid = debtPaid(payments, debt.id);
  const remaining = Math.max(0, debt.amount - paid);

  const confirmPayment = (value: number) =>
    addPayment({debtId: debt.id, amount: value});

  const removeConfirm = (payment: HistoryItemProps) =>
    confirmDestructive({
      title: '¿Eliminar abono?',
      message: `Se sumarán $${formatCurrency(payment.amount)} de vuelta al saldo pendiente.`,
      actionLabel: 'Eliminar',
      onConfirm: () => removePayment(payment.id),
    });

  const settleConfirm = () =>
    confirmDestructive({
      title: '¿Marcar como saldada?',
      message:
        remaining > 0
          ? `Aún quedan $${formatCurrency(remaining)} pendientes. Se moverá fuera de tus deudas activas.`
          : 'Se moverá fuera de tus deudas activas; su historial se conserva.',
      actionLabel: 'Saldar',
      destructive: false,
      onConfirm: () => {
        settleDebt(debt.id);
        router.back();
      },
    });

  return (
    <Screen edges={['top']} scroll>
      <Header title="Deuda" />

      <DetailHero
        badge={
          <DetailBadge tint={tint}>
            <Text className="font-satoshi-bold text-xl" style={{color: tint}}>
              {debt.person.trim().charAt(0).toUpperCase()}
            </Text>
          </DetailBadge>
        }
        title={isLent ? `${debt.person} te debe` : `Le debes a ${debt.person}`}
        amount={remaining}
        meta={
          paid > 0
            ? `Abonado $${formatCurrency(paid)} de $${formatCurrency(debt.amount)}`
            : undefined
        }
      />

      <View className="gap-8 px-5 pb-10">
        <AmountEntryToggle
          ctaLabel={isLent ? 'Registrar abono' : 'Abonar'}
          confirmLabel="Abonar"
          maxAmount={remaining}
          disabled={remaining === 0}
          onConfirm={confirmPayment}
        />

        <DetailRows
          title="Detalles"
          rows={[
            {label: 'Monto original', value: `$ ${formatCurrency(debt.amount)}`, tabular: true},
            {label: 'Registrada', value: longDate(new Date(debt.createdAt))},
            {
              label: 'Fecha acordada',
              value: debt.dueDate ? longDate(new Date(debt.dueDate)) : 'Sin fecha',
            },
          ]}
        />

        <HistoryList
          title="Abonos"
          items={debtPayments}
          emptyLabel="Sin abonos todavía"
          hint="Mantén presionado un abono para eliminarlo."
          onRemove={removeConfirm}
        />

        <GroupAction
          label="Marcar como saldada"
          caption="Dejará de aparecer en tus deudas activas; su historial se conserva."
          onPress={settleConfirm}
        />
      </View>
    </Screen>
  );
}
