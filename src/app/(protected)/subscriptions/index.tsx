import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {FlashList, type ListRenderItem} from '@shopify/flash-list';

import {Header, Screen,EmptyState,ListGap,SectionTitle} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {SubscriptionCard, SubscriptionsBanner, type Subscription} from '@/features/subscriptions';
import {useSubscriptionsStore} from '@/features/subscriptions';

const LIST_CONTENT = {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24};
const keyExtractor = (item: Subscription) => item.id;
const goNewSubscription = () => router.push(ScreenRoutes.newSubscription);

const SubscriptionsScreen = () => {
  const subscriptions = useSubscriptionsStore((s) => s.items);

  const monthlyTotal = useMemo(
    () =>
      subscriptions.reduce(
        (sum, s) => sum + (s.period === 'yearly' ? s.price / 12 : s.price),
        0,
      ),
    [subscriptions],
  );

  const renderItem = useCallback<ListRenderItem<Subscription>>(
    ({item}) => (
      <SubscriptionCard
        subscription={item}
        onPress={() => router.push(DynamicRoutes.subscription(item.id))}
      />
    ),
    [],
  );

  return (
    <Screen>
      <Header title="Suscripciones" />

      <View className="flex-1">
        <FlashList
          data={subscriptions}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={LIST_CONTENT}
          ItemSeparatorComponent={ListGap}
          ListHeaderComponent={
            subscriptions.length > 0 ? (
              <View className="gap-6 pb-3">
                <SubscriptionsBanner
                  monthlyTotal={monthlyTotal}
                  count={subscriptions.length}
                  onAdd={goNewSubscription}
                />
                <SectionTitle>Mis suscripciones</SectionTitle>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="Sin suscripciones"
              subtitle="Registra tus pagos recurrentes para ver el gasto mensual"
              actionLabel="Agregar suscripción"
              onAction={goNewSubscription}
            />
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default SubscriptionsScreen;
