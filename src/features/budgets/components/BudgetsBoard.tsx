import {Alert, Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, EmptyState, Header, Keypad, OptionRows, Screen, SheetModal, Text} from '@/components';
import {AmountDisplay} from '@/components/capture';
import {getCategory} from '@/constants';
import {formatCurrency, haptic} from '@/utils';

import {useBudgetEditor} from '../hooks/useBudgetEditor';
import {useBudgetsOverview} from '../hooks/useBudgetsOverview';
import {BudgetRow} from './BudgetRow';

export const BudgetsBoard = () => {
  const {t} = useTranslation();
  const overview = useBudgetsOverview();
  const editor = useBudgetEditor();

  const sheetTitle =
    editor.target === 'pick'
      ? t('budgets:chooseCategory')
      : editor.editingId
        ? t(getCategory(editor.editingId).labelKey)
        : undefined;

  const onBootstrap = () => {
    Alert.alert(
      t('budgets:bootstrap.confirmTitle'),
      t('budgets:bootstrap.confirmBody', {count: overview.historyCount}),
      [
        {text: t('common:actions.cancel'), style: 'cancel'},
        {
          text: t('budgets:bootstrap.action'),
          onPress: () => {
            overview.bootstrap();
            haptic.success();
          },
        },
      ],
    );
  };

  return (
    <Screen safeAreaEdges={['top']} preset="scroll">
      <Header title={t('budgets:title')} />

      <View className="gap-6 px-5 pb-10 pt-2">
        {overview.rows.length === 0 ? (
          <EmptyState
            title={t('budgets:empty.title')}
            subtitle={t('budgets:empty.body')}
            actionLabel={t('budgets:add')}
            onAction={editor.openPick}
          />
        ) : (
          <View className="gap-4 rounded-2xl bg-secundary p-4">
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="font-satoshi-medium">{t('budgets:cycleTitle')}</Text>
              <Text className="text-xs text-secundary" style={{fontVariant: ['tabular-nums']}}>
                {t('budgets:summary', {
                  spent: `$${formatCurrency(overview.totals.spent)}`,
                  cap: `$${formatCurrency(overview.totals.cap)}`,
                })}
              </Text>
            </View>

            {overview.rows.map((row) => (
              <BudgetRow
                key={row.categoryId}
                item={row}
                onPress={() => editor.openEdit(row.categoryId)}
              />
            ))}
          </View>
        )}

        {overview.rows.length > 0 && overview.availableCategories.length > 0 ? (
          <Button label={t('budgets:add')} onPress={editor.openPick} />
        ) : null}

        {overview.rows.length === 0 && overview.historyCount > 0 ? (
          <Pressable onPress={onBootstrap} hitSlop={8} className="items-center active:opacity-50">
            <Text className="font-satoshi-medium text-accent dark:text-teal-400">
              {t('budgets:fromHistory')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <SheetModal visible={editor.target !== null} onClose={editor.close} title={sheetTitle}>
        {editor.target === 'pick' ? (
          <ScrollView style={{maxHeight: 440}} showsVerticalScrollIndicator={false}>
            <OptionRows
              options={overview.availableCategories.map((category) => ({
                value: category.id,
                label: t(category.labelKey),
                icon: category.icon,
                tint: category.tint,
              }))}
              onSelect={editor.openEdit}
            />
          </ScrollView>
        ) : editor.editingId ? (
          <View className="gap-4 pt-2">
            <AmountDisplay raw={editor.raw} animatedStyle={editor.animatedStyle} />

            <Keypad onKey={editor.onKey} onErase={editor.erase} onClear={editor.clear} />

            <Button label={t('common:actions.save')} onPress={editor.save} />

            {editor.isExisting ? (
              <Pressable onPress={editor.remove} hitSlop={8} className="items-center active:opacity-50">
                <Text className="font-satoshi-medium text-red-400">{t('budgets:remove')}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </SheetModal>
    </Screen>
  );
};
