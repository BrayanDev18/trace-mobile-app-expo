import {View, type StyleProp, type ViewStyle} from 'react-native';
import Animated, {type AnimatedStyle} from 'react-native-reanimated';

import {Text} from '@/components/Text';
import {amountSizeClass, cn, displayAmount} from '@/utils';

type AmountDisplayProps = {
  raw: string;
  animatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  error?: boolean;
  accent?: boolean;
  suffix?: string;
};

export const AmountDisplay = (props: AmountDisplayProps) => {
  const {raw, animatedStyle, error, accent, suffix} = props;

  const display = displayAmount(raw);
  const hasAmount = raw !== '';
  const sizeClass = amountSizeClass(Number(raw || '0'));

  return (
    <View className="w-full flex-row items-center justify-center">
      <Animated.View style={animatedStyle} className="max-w-[72%] flex-row items-end gap-1.5">
        <Text
          className={cn(
            'pb-2 font-satoshi-medium text-3xl',
            error
              ? 'text-red-400'
              : accent && hasAmount
                ? 'text-accent dark:text-teal-400'
                : 'text-secundary',
          )}
        >
          $
        </Text>

        <Text
          numberOfLines={1}
          className={cn(
            'font-satoshi-bold tracking-tight',
            sizeClass,
            error ? 'text-red-400' : !hasAmount && 'text-secundary',
          )}
          style={{fontVariant: ['tabular-nums']}}
        >
          {display}
        </Text>

        {suffix ? <Text className="pb-2 text-secundary">{suffix}</Text> : null}
      </Animated.View>
    </View>
  );
};