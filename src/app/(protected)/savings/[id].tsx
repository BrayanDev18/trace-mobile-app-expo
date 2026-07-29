import {useMemo} from 'react';
import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {Header, Screen, DetailBadge, DetailHero, GroupAction} from '@/components';
import {DetailRows, type DetailRowProps, HistoryList, type HistoryItemProps} from '@/components';
import {AmountEntryToggle} from '@/components/capture';
import {outstandingFromSaving, useDebtsStore} from '@/features/debts';
import {ProgressBar, getSavingTheme, savingProgress, savingSaved, useSavingsStore} from '@/features/savings';
import {formatCurrency, longDate, confirmDestructive} from '@/utils';

export default function SavingDetailScreen() {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams<{id: string}>();

  const savings = useSavingsStore((s) => s.savings);
  const contributions = useSavingsStore((s) => s.contributions);
  const addContribution = useSavingsStore((s) => s.addContribution);
  const removeContribution = useSavingsStore((s) => s.removeContribution);
  const archiveSaving = useSavingsStore((s) => s.archiveSaving);
  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);

  const saving = savings.find((s) => s.id === id);
  const savingContributions = useMemo(
    () => contributions.filter((c) => c.savingId === id),
    [contributions, id],
  );

  if (!saving) return null;

  const theme = getSavingTheme(saving.themeId);
  const ThemeIcon = theme.icon;
  const onLoan = outstandingFromSaving(debts, payments, saving.id);
  const saved = savingSaved(contributions, saving.id) - onLoan;
  const hasTarget = (saving.targetAmount ?? 0) > 0;
  const {progress, percent, monthly} = savingProgress(saving, saved);

  const rows: DetailRowProps[] = [];
  if (hasTarget) {
    rows.push({
      label: t('savings:detail.target'),
      value: `$ ${formatCurrency(saving.targetAmount ?? 0)}`,
      tabular: true,
    });
  }
  rows.push({
    label: t('savings:detail.deadline'),
    value: saving.deadline ? longDate(new Date(saving.deadline)) : t('common:states.noDate'),
  });
  if (onLoan > 0) {
    rows.push({label: t('savings:detail.onLoan'), value: `$ ${formatCurrency(onLoan)}`, tabular: true});
  }
  if (monthly !== null) {
    rows.push({
      label: t('savings:detail.pace'),
      value: t('savings:detail.paceValue', {amount: formatCurrency(monthly)}),
      tabular: true,
    });
  }

  const confirmContribution = (value: number) => addContribution({savingId: saving.id, amount: value});

  const removeConfirm = (contribution: HistoryItemProps) =>
    confirmDestructive({
      title: t('savings:removeContribution.title'),
      message: t('savings:removeContribution.body', {amount: formatCurrency(contribution.amount)}),
      actionLabel: t('common:actions.delete'),
      onConfirm: () => removeContribution(contribution.id),
    });

  const archiveConfirm = () =>
    confirmDestructive({
      title: t('savings:archive.title'),
      message: t('savings:archive.body'),
      actionLabel: t('savings:archive.action'),
      onConfirm: () => {
        archiveSaving(saving.id);
        router.back();
      },
    });

  return (
    <Screen safeAreaEdges={['top']} preset="scroll">
      <Header title={t('savings:detail.title')} />

      <DetailHero
        badge={
          <DetailBadge tint={theme.tint}>
            <ThemeIcon size={25} color={theme.tint} />
          </DetailBadge>
        }
        title={saving.name}
        amount={saved}
        meta={
          hasTarget
            ? t('savings:detail.heroMeta', {percent, amount: formatCurrency(saving.targetAmount ?? 0)})
            : t('savings:detail.openFund')
        }
      >
        {hasTarget ? <ProgressBar progress={progress} className="w-full" /> : null}
      </DetailHero>

      <View className="gap-8 px-5 pb-10">
        <AmountEntryToggle
          ctaLabel={t('savings:detail.contribute')}
          confirmLabel={t('savings:detail.contribute')}
          onConfirm={confirmContribution}
        />

        <DetailRows title={t('common:states.details')} rows={rows} />

        <HistoryList
          title={t('savings:detail.contributions')}
          items={savingContributions}
          emptyLabel={t('savings:detail.contributionsEmpty')}
          hint={t('savings:detail.contributionsHint')}
          onRemove={removeConfirm}
        />

        <GroupAction
          destructive
          label={t('savings:archive.label')}
          caption={t('savings:archive.body')}
          onPress={archiveConfirm}
        />
      </View>
    </Screen>
  );
}