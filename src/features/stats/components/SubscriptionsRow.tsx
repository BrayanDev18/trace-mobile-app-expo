import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconChevronRight} from '@tabler/icons-react-native';

import {Group, Row, Text} from '@/components';
import {navigate} from '@/constants';
import {useSubscriptionsStore} from '@/features/subscriptions';
import {formatCurrency} from '@/utils';
import {useIconColors} from '@/hooks/useIconColors';

const goSubscriptions = () => navigate('subscriptions');

export const SubscriptionsRow = () => {
  const {t} = useTranslation();
  const {faint} = useIconColors();
  const subscriptions = useSubscriptionsStore((s) => s.items);

  const monthly = subscriptions.reduce(
    (sum, s) => sum + (s.period === 'yearly' ? s.price / 12 : s.price),
    0,
  );

  if (subscriptions.length === 0) return null;

  return (
    <Group>
      <Pressable
        onPress={goSubscriptions}
        className="active:bg-neutral-200 dark:active:bg-white/5"
      >
        <Row label={t('stats:subscriptions.label')}>
          <View className="flex-row items-center gap-2">
            <Text className="text-secundary" style={{fontVariant: ['tabular-nums']}}>
              {t('stats:subscriptions.perMonth', {amount: formatCurrency(monthly)})}
            </Text>
            <IconChevronRight size={16} color={faint} />
          </View>
        </Row>
      </Pressable>
    </Group>
  );
};