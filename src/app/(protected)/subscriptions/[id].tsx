import {View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {Group, Header, Row, Screen, Separator, Text,GroupAction} from '@/components';
import {getPaymentMethod} from '@/constants';
import {SubscriptionHeroCard,useSubscriptionsStore} from '@/features/subscriptions';
import {formatCurrency,confirmDestructive,shortDate} from '@/utils';

export default function SubscriptionDetailScreen() {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams<{id: string}>();

  const subscriptions = useSubscriptionsStore((s) => s.items);
  const remove = useSubscriptionsStore((s) => s.remove);
  const subscription = subscriptions.find((s) => s.id === id);

  if (!subscription) return null;

  const method = subscription.methodId ? getPaymentMethod(subscription.methodId) : undefined;
  const period = t(subscription.period === 'yearly' ? 'subscriptions:period.year' : 'subscriptions:period.month');

  const deleteConfirm = () =>
    confirmDestructive({
      title: t('subscriptions:delete.confirmTitle'),
      message: t('subscriptions:delete.confirmBody'),
      actionLabel: t('common:actions.delete'),
      onConfirm: () => {
        remove(subscription.id);
        router.back();
      },
    });

  return (
    <Screen safeAreaEdges={['top']} preset="scroll">
      <Header />

      <View className="gap-8 px-5 pb-10 pt-2">
        <SubscriptionHeroCard subscription={subscription} />

        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">{t('common:states.details')}</Text>

          <Group>
            <Row label={t('subscriptions:detail.paymentMethod')}>
              {method && <method.Icon size={18} />}
              <Text className="text-secundary">{method ? t(method.labelKey) : '—'}</Text>
            </Row>

            <Separator />

            <Row label={t('subscriptions:detail.price')}>
              <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
                ${formatCurrency(subscription.price)}/{period}
              </Text>
            </Row>

            <Separator />

            <Row label={t('subscriptions:detail.nextCharge')}>
              <Text className="text-secundary">
                {shortDate(new Date(subscription.nextCharge))}
              </Text>
            </Row>

            <Separator />

            <Row label={t('subscriptions:detail.status')}>
              <View className="rounded-full bg-accent/10 px-2.5 py-1">
                <Text className="font-satoshi-medium text-sm text-accent dark:text-teal-400">
                  {t('subscriptions:status.active')}
                </Text>
              </View>
            </Row>
          </Group>
        </View>

        <GroupAction
          destructive
          label={t('subscriptions:delete.action')}
          caption={t('subscriptions:delete.confirmBody')}
          onPress={deleteConfirm}
        />
      </View>
    </Screen>
  );
}
