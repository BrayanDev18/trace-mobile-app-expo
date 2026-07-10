import {ReactNode} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import * as Haptics from 'expo-haptics';
import {IconApps} from '@tabler/icons-react-native';

import {DottedGlowBackground, Group, Header, Screen, Separator, Text} from '@/components';
import {getPaymentMethod} from '@/constants';
import {useSubscriptionsStore} from '@/store/subscriptions';
import {formatCurrency} from '@/utils';

const isIOS = process.env.EXPO_OS === 'ios';

const Row = ({label, children}: { label: string; children: ReactNode }) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text className="font-satoshi-medium">{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);

export default function SubscriptionDetailScreen() {
  const {id} = useLocalSearchParams<{ id: string }>();

  const subscriptions = useSubscriptionsStore((s) => s.items);
  const remove = useSubscriptionsStore((s) => s.remove);
  const subscription = subscriptions.find((s) => s.id === id) ?? subscriptions[0];

  if (!subscription) return null;

  const ServiceIcon = subscription.icon ?? IconApps;
  const method = subscription.methodId ? getPaymentMethod(subscription.methodId) : undefined;
  const period = subscription.period === 'yearly' ? 'año' : 'mes';
  const price = formatCurrency(subscription.price);

  const confirmDelete = () => {
    Alert.alert('¿Eliminar suscripción?', 'Dejará de aparecer en tu lista y en el total mensual.', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          remove(subscription.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen edges={['top']} scroll>
      <Header />

      <View className="gap-8 px-5 pb-10 pt-2">
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
                  <ServiceIcon size={28} color="#171717"/>
                )}
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="font-satoshi-bold text-xl tracking-tight">
                  {subscription.name}
                </Text>

                <Text numberOfLines={1}>
                  {subscription.category}
                </Text>
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
                  ${price}
                </Text>

                <Text className="pb-1.5 pl-1 text-neutral-600 dark:text-white/80">/{period}</Text>
              </View>

              <Text className="text-sm text-neutral-600 dark:text-white/80">
                Próximo cobro · {subscription.nextCharge}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium">Detalles</Text>

          <Group>
            <Row label="Método de pago">
              {method && <method.Icon size={18}/>}
              <Text className="text-secundary">{method?.label ?? '—'}</Text>
            </Row>

            <Separator/>

            <Row label="Precio">
              <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                ${price}/{period}
              </Text>
            </Row>

            <Separator/>

            <Row label="Próximo cobro">
              <Text className="text-secundary">{subscription.nextCharge}</Text>
            </Row>

            <Separator/>

            <Row label="Estado">
              <View className="rounded-full bg-accent/10 px-2.5 py-1">
                <Text className="font-satoshi-medium text-sm text-accent dark:text-teal-400">
                  Activa
                </Text>
              </View>
            </Row>
          </Group>
        </View>

        <View className="gap-2">
          <Group>
            <Pressable
              onPress={confirmDelete}
              className="min-h-14 items-center justify-center px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <Text className="text-red-400 font-satoshi-medium text-lg">Eliminar suscripción</Text>
            </Pressable>
          </Group>
          <Text className="px-4 text-xs text-secundary">
            Dejará de aparecer en tu lista y en el total mensual.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
