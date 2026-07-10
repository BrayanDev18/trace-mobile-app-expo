import {useMemo} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';

import {Header, Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {SubscriptionCard, SubscriptionsBanner} from '@/screens/subscriptions';
import {useSubscriptionsStore} from '@/store/subscriptions';

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
    <Screen scroll>
      <Header title="Suscripciones" />

      <View className="gap-6 px-5 py-4">
        <SubscriptionsBanner
          monthlyTotal={monthlyTotal}
          count={subscriptions.length}
          onAdd={() => router.push(ScreenRoutes.newSubscription)}
        />

        <View className="gap-3">
          <Text className="font-satoshi-medium text-lg">Mis suscripciones</Text>

          <View className="gap-3">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onPress={() => router.push(DynamicRoutes.subscription(subscription.id))}
              />
            ))}
          </View>
        </View>

      </View>
    </Screen>
  );
};

export default SubscriptionScreen;