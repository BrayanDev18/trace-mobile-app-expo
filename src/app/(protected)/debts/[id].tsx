import {useMemo} from 'react';
import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {
  Header,
  Screen,
  Text,
  DetailBadge,
  DetailHero,
  DetailRows,
  type DetailRowProps,
  GroupAction,
  HistoryList,
  type HistoryItemProps,
} from '@/components';
import {AmountEntryToggle} from '@/components/capture';
import {Colors} from '@/constants';
import {debtPaid, useDebtsStore} from '@/features/debts';
import {useSavingsStore} from '@/features/savings';
import {formatCurrency, longDate,confirmDestructive} from '@/utils';

export default function DebtDetailScreen() {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams<{id: string}>();

  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);
  const addPayment = useDebtsStore((s) => s.addPayment);
  const removePayment = useDebtsStore((s) => s.removePayment);
  const settleDebt = useDebtsStore((s) => s.settleDebt);
  const savings = useSavingsStore((s) => s.savings);

  const debt = debts.find((d) => d.id === id);
  const debtPayments = useMemo(() => payments.filter((p) => p.debtId === id), [payments, id]);

  if (!debt) return null;

  const isLent = debt.direction === 'lent';
  const tint = isLent ? Colors.up : Colors.down;
  const paid = debtPaid(payments, debt.id);
  const remaining = Math.max(0, debt.amount - paid);

  const sourceLabel =
    isLent && debt.source
      ? debt.source.kind === 'income'
        ? t('debts:source.income')
        : debt.source.kind === 'total'
          ? t('debts:source.total')
          : savings.find((s) => s.id === debt.source?.savingId)?.name ?? t('debts:source.total')
      : null;

  const rows: DetailRowProps[] = [
    {label: t('debts:detail.rows.original'), value: `$ ${formatCurrency(debt.amount)}`, tabular: true},
  ];
  if (sourceLabel) rows.push({label: t('debts:source.label'), value: sourceLabel});
  rows.push({label: t('debts:detail.rows.created'), value: longDate(new Date(debt.createdAt))});
  rows.push({
    label: t('debts:detail.rows.agreed'),
    value: debt.dueDate ? longDate(new Date(debt.dueDate)) : t('common:states.noDate'),
  });

  const confirmPayment = (value: number) =>
    addPayment({debtId: debt.id, amount: value});

  const removeConfirm = (payment: HistoryItemProps) =>
    confirmDestructive({
      title: t('debts:dialogs.removePayment.title'),
      message: t('debts:dialogs.removePayment.message', {amount: formatCurrency(payment.amount)}),
      actionLabel: t('common:actions.delete'),
      onConfirm: () => removePayment(payment.id),
    });

  const settleConfirm = () =>
    confirmDestructive({
      title: t('debts:dialogs.settle.title'),
      message:
        remaining > 0
          ? t('debts:dialogs.settle.pending', {remaining: formatCurrency(remaining)})
          : t('debts:dialogs.settle.clear'),
      actionLabel: t('debts:dialogs.settle.confirm'),
      destructive: false,
      onConfirm: () => {
        settleDebt(debt.id);
        router.back();
      },
    });

  return (
    <Screen edges={['top']} scroll>
      <Header title={t('debts:detail.title')} />

      <DetailHero
        badge={
          <DetailBadge tint={tint}>
            <Text className="font-satoshi-bold text-xl" style={{color: tint}}>
              {debt.person.trim().charAt(0).toUpperCase()}
            </Text>
          </DetailBadge>
        }
        title={isLent ? t('debts:detail.heroLent', {person: debt.person}) : t('debts:detail.heroOwed', {person: debt.person})}
        amount={remaining}
        meta={
          paid > 0
            ? t('debts:detail.progress', {paid: formatCurrency(paid), amount: formatCurrency(debt.amount)})
            : undefined
        }
      />

      <View className="gap-8 px-5 pb-10">
        <AmountEntryToggle
          ctaLabel={isLent ? t('debts:detail.payCta') : t('debts:detail.payShort')}
          confirmLabel={t('debts:detail.payShort')}
          maxAmount={remaining}
          disabled={remaining === 0}
          onConfirm={confirmPayment}
        />

        <DetailRows title={t('common:states.details')} rows={rows} />

        <HistoryList
          title={t('debts:detail.payments.title')}
          items={debtPayments}
          emptyLabel={t('debts:detail.payments.empty')}
          hint={t('debts:detail.payments.hint')}
          onRemove={removeConfirm}
        />

        <GroupAction
          label={t('debts:detail.settle.label')}
          caption={t('debts:detail.settle.caption')}
          onPress={settleConfirm}
        />
      </View>
    </Screen>
  );
}
