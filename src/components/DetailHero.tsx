import {ReactNode} from 'react';
import {View} from 'react-native';

import {Text} from '@/components/Text';
import {amountSizeClass, cn, formatCurrency} from '@/utils';

type DetailHeroProps = {
  title: string;
  amount: number;
  badge?: ReactNode;
  prefix?: string;
  accent?: boolean;
  meta?: string;
  children?: ReactNode;
};

export const DetailHero = (props: DetailHeroProps) => {
  const {title, amount, badge, prefix = '', accent, meta, children} = props;

  return (
    <View className="items-center gap-4 px-6 pb-8 pt-6">
      {badge}

      <View className="items-center gap-1">
        <Text numberOfLines={2} className="text-center font-satoshi-medium">
          {title}
        </Text>

        <Text
          selectable
          numberOfLines={1}
          className={cn(
            'font-satoshi-bold tracking-tight',
            amountSizeClass(amount),
            accent && 'text-accent dark:text-teal-400',
          )}
          style={{fontVariant: ['tabular-nums']}}
        >
          {prefix}${formatCurrency(amount)}
        </Text>

        {meta ? (
          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            {meta}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );
};

export const DetailBadge = ({tint, children}: {tint: string; children: ReactNode}) => (
  <View
    className="h-14 w-14 items-center justify-center rounded-xl"
    style={{backgroundColor: `${tint}1f`}}
  >
    {children}
  </View>
);