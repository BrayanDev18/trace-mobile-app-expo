import {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {Image} from 'expo-image';
import {IconChevronRight} from '@tabler/icons-react-native';

import {Group, Header, Row, Screen, Separator, SheetModal, Text,DetailHero,GroupAction} from '@/components';
import {getCategory, getPaymentMethod} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';
import {useMovementsStore} from '@/features/expenses';
import {longDate, relativeDate,confirmDestructive} from '@/utils';

export default function ExpenseDetailScreen() {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams<{id: string}>();
  const {faint} = useIconColors();

  const [receiptOpen, setReceiptOpen] = useState(false);

  const movements = useMovementsStore((s) => s.items);
  const remove = useMovementsStore((s) => s.remove);
  const movement = movements.find((m) => m.id === id);

  if (!movement) return null;

  const isIncome = movement.type === 'income';
  const date = new Date(movement.date);
  const category = getCategory(movement.categoryId);
  const method = movement.methodId ? getPaymentMethod(movement.methodId) : undefined;
  const CategoryIcon = category.icon;
  const receipts = movement.receiptUris ?? [];

  const deleteConfirm = () =>
    confirmDestructive({
      title: isIncome ? t('expenses:delete.confirmTitleIncome') : t('expenses:delete.confirmTitleExpense'),
      message: t('expenses:delete.confirmBody'),
      actionLabel: t('common:actions.delete'),
      onConfirm: () => {
        remove(movement.id);
        router.back();
      },
    });

  return (
    <Screen safeAreaEdges={['top']} preset="scroll">
      <Header title={isIncome ? t('expenses:detail.titleIncome') : t('expenses:detail.titleExpense')} />

      <DetailHero
        title={movement.reason || t(category.labelKey)}
        amount={movement.amount}
        prefix={isIncome ? '+' : '-'}
        accent={isIncome}
        meta={relativeDate(date)}
      />

      <View className="gap-8 px-5 pb-10">
        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">{t('common:states.details')}</Text>

          <Group>
            <Row label={t('expenses:detail.category')}>
              <CategoryIcon size={17} color={category.tint} />
              <Text className="text-secundary">{t(category.labelKey)}</Text>
            </Row>
            <Separator />
            <Row label={t('expenses:detail.method')}>
              {method ? <method.Icon size={17} /> : null}
              <Text className="text-secundary">{method ? t(method.labelKey) : '—'}</Text>
            </Row>
            <Separator />
            <Row label={t('expenses:detail.date')}>
              <Text selectable className="text-secundary">
                {longDate(date)}
              </Text>
            </Row>
            <Separator />
            {receipts.length ? (
              <Pressable
                accessibilityLabel={t('expenses:detail.viewReceipt')}
                onPress={() => setReceiptOpen(true)}
                className="active:bg-neutral-200 dark:active:bg-white/5"
              >
                <Row label={t('expenses:detail.receipt')}>
                  <Image
                    source={{uri: receipts[0]}}
                    style={{width: 28, height: 28, borderRadius: 6}}
                    contentFit="cover"
                  />
                  {receipts.length > 1 ? (
                    <Text className="text-secundary">{t('expenses:detail.receiptCount', {count: receipts.length})}</Text>
                  ) : null}
                  <IconChevronRight size={16} color={faint} />
                </Row>
              </Pressable>
            ) : (
              <Row label={t('expenses:detail.receipt')}>
                <Text className="text-secundary">{t('common:states.none')}</Text>
              </Row>
            )}
          </Group>
        </View>

        <GroupAction
          destructive
          label={isIncome ? t('expenses:delete.actionIncome') : t('expenses:delete.actionExpense')}
          caption={t('expenses:delete.confirmBody')}
          onPress={deleteConfirm}
        />
      </View>

      <SheetModal visible={receiptOpen} onClose={() => setReceiptOpen(false)} title={t('expenses:detail.receipt')}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 440}}
          contentContainerStyle={{gap: 12}}
        >
          {receipts.map((uri) => (
            <Image
              key={uri}
              source={{uri}}
              style={{width: '100%', height: 300, borderRadius: 20}}
              contentFit="cover"
            />
          ))}
        </ScrollView>
      </SheetModal>
    </Screen>
  );
}
