import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {Header, Screen, EmptyState, ListGap, SectionTitle} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {outstandingFromSaving, useDebtsStore} from '@/features/debts';
import {SavingCard, SavingsOverview, savingSaved, useSavingsStore, type SavingProps} from '@/features/savings';

type RowProps = {saving: SavingProps; saved: number};

const LIST_CONTENT = {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24};
const keyExtractor = ({saving}: RowProps) => saving.id;
const goNewSaving = () => router.push(ScreenRoutes.newSaving);

const SavingsScreen = () => {
  const {t} = useTranslation();
  const savings = useSavingsStore((s) => s.savings);
  const contributions = useSavingsStore((s) => s.contributions);
  const debts = useDebtsStore((s) => s.debts);
  const payments = useDebtsStore((s) => s.payments);

  const active = useMemo(
    () =>
      savings
        .filter((s) => !s.archivedAt)
        .map((saving) => ({
          saving,
          saved: savingSaved(contributions, saving.id) - outstandingFromSaving(debts, payments, saving.id),
        })),
    [savings, contributions, debts, payments],
  );

  const totalSaved = useMemo(() => active.reduce((acc, {saved}) => acc + saved, 0), [active]);

  const renderItem = useCallback<ListRenderItem<RowProps>>(
    ({item}) => (
      <SavingCard
        saving={item.saving}
        saved={item.saved}
        onPress={() => router.push(DynamicRoutes.saving(item.saving.id))}
      />
    ),
    [],
  );

  return (
    <Screen>
      <Header title={t('savings:title')} />

      <View className="flex-1">
        <FlashList
          data={active}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={LIST_CONTENT}
          ItemSeparatorComponent={ListGap}
          ListHeaderComponent={
            active.length > 0 ? (
              <View className="gap-6 py-3">
                <SavingsOverview saved={totalSaved} count={active.length} onAdd={goNewSaving} />
                <SectionTitle>{t('savings:mine')}</SectionTitle>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title={t('savings:empty.title')}
              subtitle={t('savings:empty.subtitle')}
              actionLabel={t('savings:newSaving')}
              onAction={goNewSaving}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default SavingsScreen;