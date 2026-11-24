import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, EmptyState, Header, Keypad, Screen, SheetModal, Text} from '@/components';
import {AmountDisplay} from '@/components/capture';
import {navigate} from '@/constants';
import {cn, formatCurrency} from '@/utils';

import {useBudgetEditor} from '../hooks/useBudgetEditor';
import {useBudgetsOverview} from '../hooks/useBudgetsOverview';
import {BudgetRow} from './BudgetRow';

export const BudgetsBoard = () => {
  const {t} = useTranslation();
  const overview = useBudgetsOverview();
  const editor = useBudgetEditor();

  if (!overview) {
    return (
      <Screen safeAreaEdges={['top']}>
        <Header title={t('budgets:title')} />
        <View className="px-5">
          <EmptyState
            title={t('budgets:noCycle.title')}
            subtitle={t('budgets:noCycle.body')}
            actionLabel={t('budgets:noCycle.action')}
            onAction={() => navigate('incomeSetup')}
          />
        </View>
      </Screen>
    );
  }

  const overAssigned = overview.toAssign !== null && overview.toAssign < 0;

  return (
    <Screen safeAreaEdges={['top']} preset="scroll">
      <Header title={t('budgets:title')} />

      <View className="gap-6 px-5 pb-10 pt-2">
        {overview.toAssign !== null && (
          <View className="items-center gap-1 rounded-2xl bg-secundary p-5">
            <Text className="text-sm text-secundary">{t('budgets:toAssign')}</Text>
            <Text
              numberOfLines={1}
              className={cn('font-satoshi-bold text-5xl tracking-tight', overAssigned && 'text-red-400')}
              style={{fontVariant: ['tabular-nums']}}
            >
              ${formatCurrency(overview.toAssign)}
            </Text>
            <Text className="text-xs text-secundary">
              {overAssigned
                ? t('budgets:overAssigned')
                : t('budgets:ofIncome', {amount: `$${formatCurrency(overview.income ?? 0)}`})}
            </Text>
          </View>
        )}

        {overview.rows.length === 0 ? (
          <EmptyState
            title={t('budgets:empty.title')}
            subtitle={t('budgets:empty.body')}
            actionLabel={t('budgets:newBudget')}
            onAction={() => navigate('newBudget')}
          />
        ) : (
          <View className="gap-4 rounded-2xl bg-secundary p-4">
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="font-satoshi-medium">{t('budgets:cycleTitle')}</Text>
              <Text className="text-xs text-secundary" style={{fontVariant: ['tabular-nums']}}>
                {t('budgets:summary', {
                  spent: `$${formatCurrency(overview.spent)}`,
                  assigned: `$${formatCurrency(overview.assigned)}`,
                })}
              </Text>
            </View>

            {overview.rows.map((row) => (
              <BudgetRow key={row.budget.id} item={row} onPress={() => editor.open(row.budget.id)} />
            ))}
          </View>
        )}

        {overview.rows.length > 0 && (
          <Button label={t('budgets:newBudget')} onPress={() => navigate('newBudget')} />
        )}
      </View>

      <SheetModal visible={editor.editing !== null} onClose={editor.close} title={editor.editing?.name}>
        <View className="gap-4 pt-2">
          <AmountDisplay raw={editor.raw} animatedStyle={editor.animatedStyle} />

          <Keypad onKey={editor.onKey} onErase={editor.erase} onClear={editor.clear} />

          <Button label={t('common:actions.save')} onPress={editor.save} />

          <Pressable onPress={editor.remove} hitSlop={8} className="items-center active:opacity-50">
            <Text className="font-satoshi-medium text-red-400">{t('budgets:remove')}</Text>
          </Pressable>
        </View>
      </SheetModal>
    </Screen>
  );
};
