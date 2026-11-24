import {memo} from 'react';
import {Pressable, View} from 'react-native';
import {Image} from 'expo-image';
import {useTranslation} from 'react-i18next';
import {IconApps, IconChevronRight, IconClock} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {getPaymentMethod} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';
import {formatCurrency, shortDate, sizedLogo} from '@/utils';

import type {SubscriptionProps} from '../types';

type SubscriptionCardProps = {
  subscription: SubscriptionProps;
  onPress?: () => void;
};

export const SubscriptionCard = memo(function SubscriptionCard({subscription, onPress}: SubscriptionCardProps) {
  const {t} = useTranslation();
  const {primary: glyph, muted, faint} = useIconColors();

  const ServiceIcon = subscription.icon ?? IconApps;
  const method = subscription.methodId ? getPaymentMethod(subscription.methodId) : undefined;
  const period = t(subscription.period === 'yearly' ? 'subscriptions:period.year' : 'subscriptions:period.month');
  const price = `$${formatCurrency(subscription.price)}/${period}`;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-2xl bg-secundary p-3 active:opacity-70"
    >
      <View className="h-14 w-14 items-center justify-center rounded-xl">
        {subscription.logoUrl ? (
          <Image
            source={{uri: sizedLogo(subscription.logoUrl, 48)}}
            recyclingKey={subscription.id}
            style={{width: 48, height: 48, borderRadius: 9}}
            contentFit="contain"
          />
        ) : (
          <ServiceIcon size={25} color={glyph}/>
        )}
      </View>

      <View className="flex-1 gap-1.5">
        <Text className="font-satoshi-medium text-[16px]">{subscription.name}</Text>

        <View className="flex-row items-center gap-2.5">
          <View className="rounded-lg px-2 py-1 bg-tertiary">
            <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
              {price}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <IconClock size={14} color={muted}/>
            <Text className="text-sm text-secundary">
              {shortDate(new Date(subscription.nextCharge))}
            </Text>
          </View>

          {method && (
            <View className="shrink flex-row items-center gap-1">
              <method.Icon size={14}/>
              <Text numberOfLines={1} className="text-sm text-secundary">
                {t(method.labelKey)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <IconChevronRight size={18} color={faint}/>
    </Pressable>
  );
});
