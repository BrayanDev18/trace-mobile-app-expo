import {View} from 'react-native';
import {Image} from 'expo-image';
import {IconApps} from '@tabler/icons-react-native';

import {DottedGlowBackground, Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';
import {formatCurrency} from '@/utils';

import type {Subscription} from '../types';

export const SubscriptionHeroCard = ({subscription}: {subscription: Subscription}) => {
  const {primary} = useIconColors();

  const ServiceIcon = subscription.icon ?? IconApps;
  const period = subscription.period === 'yearly' ? 'año' : 'mes';

  return (
    <View className="overflow-hidden rounded-3xl">
      <DottedGlowBackground
        color="rgba(24,27,32,0.55)"
        darkColor="rgba(255,255,255,0.6)"
        gap={14}
        radius={1.5}
        opacity={0.12}
      />

      <View className="gap-6 p-5">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-2xl">
            {subscription.logoUrl ? (
              <Image
                source={{uri: subscription.logoUrl}}
                style={{width: 46, height: 46, borderRadius: 11}}
                contentFit="contain"
              />
            ) : (
              <ServiceIcon size={28} color={primary} />
            )}
          </View>

          <View className="flex-1">
            <Text numberOfLines={1} className="font-satoshi-bold text-xl tracking-tight">
              {subscription.name}
            </Text>
            <Text numberOfLines={1}>{subscription.domain}</Text>
          </View>
        </View>

        <View className="gap-1">
          <View className="flex-row items-end">
            <Text
              selectable
              numberOfLines={1}
              className="font-satoshi-medium text-5xl tracking-tight"
              style={{fontVariant: ['tabular-nums']}}
            >
              ${formatCurrency(subscription.price)}
            </Text>
            <Text className="pb-1.5 pl-1 text-secundary">/{period}</Text>
          </View>

          <Text className="text-sm text-secundary">
            Próximo cobro · {subscription.nextCharge}
          </Text>
        </View>
      </View>
    </View>
  );
};
