import {View} from 'react-native';

import {DottedGlowBackground} from '@/components/DottedGlowBackground';
import {PrimaryButton} from '@/components/PrimaryButton';
import {Text} from '@/components/Text';
import {amountSizeClass, cn, formatCurrency} from '@/utils';

type OverviewBannerProps = {
  title: string;
  amount: number;
  meta: string;
  actionLabel: string;
  onAction?: () => void;
};

export const OverviewBanner = (props: OverviewBannerProps) => {
  const {title, amount, meta, actionLabel, onAction} = props;

  return (
    <View className="overflow-hidden rounded-3xl">
      <DottedGlowBackground
        color="rgba(24,27,32,0.55)"
        darkColor="rgba(255,255,255,0.6)"
        gap={14}
        radius={1.5}
        opacity={0.12}
      />

      <View className="gap-5 p-5">
        <View className="gap-3">
          <Text className="text-sm text-secundary">{title}</Text>

          <Text
            numberOfLines={1}
            className={cn('font-satoshi-bold tracking-tight', amountSizeClass(amount, 'card'))}
            style={{fontVariant: ['tabular-nums']}}
          >
            {amount < 0 ? '-' : ''}$ {formatCurrency(Math.abs(amount))}
          </Text>

          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            {meta}
          </Text>
        </View>

        <PrimaryButton label={actionLabel} onPress={onAction} />
      </View>
    </View>
  );
};
