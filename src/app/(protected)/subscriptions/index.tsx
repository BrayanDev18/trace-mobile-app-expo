import {useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {FlashList} from '@shopify/flash-list';

import {Header, Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {SubscriptionCard, SubscriptionsBanner} from '@/screens/subscriptions';
import {useSubscriptionsStore} from '@/store/subscriptions';

const Gap = () => <View className="h-3" />;

const SubscriptionScreen = () => {
  const subscriptions = useSubscriptionsStore((s) => s.items);

  const monthlyTotal = useMemo(
    () =>
      subscriptions.reduce(
        (sum, s) => sum + (s.period === 'yearly' ? s.price / 12 : s.price),
        0,
      ),
    [subscriptions],
  );

  return (
    <Screen>
      <Header title="Suscripciones" />

      <View className="flex-1">
        <FlashList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24}}
          ItemSeparatorComponent={Gap}
          ListHeaderComponent={
            <View className="gap-6 pb-3">
              <SubscriptionsBanner
                monthlyTotal={monthlyTotal}
                count={subscriptions.length}
                onAdd={() => router.push(ScreenRoutes.newSubscription)}
              />
              <Text className="font-satoshi-medium text-lg">Mis suscripciones</Text>
            </View>
          }
          renderItem={({item}) => (
            <SubscriptionCard
              subscription={item}
              onPress={() => router.push(DynamicRoutes.subscription(item.id))}
            />
          )}
        />
      </View>
    </Screen>
  );
};

export default SubscriptionScreen;
