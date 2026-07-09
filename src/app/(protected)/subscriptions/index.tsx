import {useMemo} from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {IconChevronLeft} from '@tabler/icons-react-native';

import {Screen, Text} from '@/components';
import {DynamicRoutes, ScreenRoutes} from '@/constants';
import {SubscriptionCard, SubscriptionsBanner} from '@/screens/subscriptions';
import {useSubscriptionsStore} from '@/store/subscriptions';

const SubscriptionScreen = () => {
  const scheme = useColorScheme();
  const tint = scheme === 'dark' ? '#34d399' : '#059669';
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
      <View className="h-12 flex-row items-center justify-between px-3">
        <Pressable
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center active:opacity-50"
        >
          <IconChevronLeft size={26} color={tint} />
        </Pressable>
        <Text className="font-satoshi-bold text-base text-primary">Suscripciones</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="gap-6 px-5 py-4">
        <SubscriptionsBanner
          monthlyTotal={monthlyTotal}
          count={subscriptions.length}
          onAdd={() => router.push(ScreenRoutes.newSubscription)}
        />

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
    </Screen>
  );
};

export default SubscriptionScreen;