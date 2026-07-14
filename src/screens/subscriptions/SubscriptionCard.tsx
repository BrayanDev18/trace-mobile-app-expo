import type {ComponentType} from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import {Image} from 'expo-image';
import {IconApps, IconChevronRight, IconClock} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {getPaymentMethod} from '@/constants';
import {formatCurrency} from '@/utils';

import {sizedLogo} from './useBrandSearch';

export type BrandIcon = ComponentType<{ size?: number; color?: string }>;

export type Subscription = {
  id: string;
  name: string;
  category: string;
  icon?: BrandIcon;
  logoUrl?: string;
  price: number;
  period: 'monthly' | 'yearly';
  nextCharge: string;
  methodId?: string;
};

type SubscriptionCardProps = {
  subscription: Subscription;
  onPress?: () => void;
};

export const SubscriptionCard = ({subscription, onPress}: SubscriptionCardProps) => {
  const scheme = useColorScheme();
  const glyph = scheme === 'dark' ? '#ffffff' : '#000000';
  const muted = scheme === 'dark' ? '#a3a3a3' : '#737373';
  const faint = scheme === 'dark' ? '#525252' : '#a3a3a3';

  const ServiceIcon = subscription.icon ?? IconApps;
  const method = subscription.methodId ? getPaymentMethod(subscription.methodId) : undefined;
  const price = `$${formatCurrency(subscription.price)}/${subscription.period === 'yearly' ? 'año' : 'mes'}`;

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
              {subscription.nextCharge}
            </Text>
          </View>

          {method && (
            <View className="shrink flex-row items-center gap-1">
              <method.Icon size={14}/>
              <Text numberOfLines={1} className="text-sm text-secundary">
                {method.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      <IconChevronRight size={18} color={faint}/>
    </Pressable>
  );
};
