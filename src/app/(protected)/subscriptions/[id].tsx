import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';

import {Group, Header, Row, Screen, Separator, Text,GroupAction} from '@/components';
import {getPaymentMethod} from '@/constants';
import {SubscriptionHeroCard,useSubscriptionsStore} from '@/features/subscriptions';
import {formatCurrency,confirmDestructive} from '@/utils';

export default function SubscriptionDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();

  const subscriptions = useSubscriptionsStore((s) => s.items);
  const remove = useSubscriptionsStore((s) => s.remove);
  const subscription = subscriptions.find((s) => s.id === id);

  if (!subscription) return null;

  const method = subscription.methodId ? getPaymentMethod(subscription.methodId) : undefined;
  const period = subscription.period === 'yearly' ? 'año' : 'mes';

  const deleteConfirm = () =>
    confirmDestructive({
      title: '¿Eliminar suscripción?',
      message: 'Dejará de aparecer en tu lista y en el total mensual.',
      actionLabel: 'Eliminar',
      onConfirm: () => {
        remove(subscription.id);
        router.back();
      },
    });

  return (
    <Screen edges={['top']} scroll>
      <Header />

      <View className="gap-8 px-5 pb-10 pt-2">
        <SubscriptionHeroCard subscription={subscription} />

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Detalles</Text>

          <Group>
            <Row label="Método de pago">
              {method && <method.Icon size={18} />}
              <Text className="text-secundary">{method?.label ?? '—'}</Text>
            </Row>

            <Separator />

            <Row label="Precio">
              <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                ${formatCurrency(subscription.price)}/{period}
              </Text>
            </Row>

            <Separator />

            <Row label="Próximo cobro">
              <Text className="text-secundary">{subscription.nextCharge}</Text>
            </Row>

            <Separator />

            <Row label="Estado">
              <View className="rounded-full bg-accent/10 px-2.5 py-1">
                <Text className="font-satoshi-medium text-sm text-accent dark:text-teal-400">
                  Activa
                </Text>
              </View>
            </Row>
          </Group>
        </View>

        <GroupAction
          destructive
          label="Eliminar suscripción"
          caption="Dejará de aparecer en tu lista y en el total mensual."
          onPress={deleteConfirm}
        />
      </View>
    </Screen>
  );
}
