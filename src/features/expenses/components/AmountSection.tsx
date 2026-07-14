import {useWatch, type Control} from 'react-hook-form';
import type {StyleProp, ViewStyle} from 'react-native';
import type {AnimatedStyle} from 'react-native-reanimated';

import {AmountDisplay} from '@/components/capture';
import {ExpenseFormValuesProps} from "@/features/expenses";

type AmountSectionProps = {
  control: Control<ExpenseFormValuesProps>;
  animatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  error: boolean;
};

export const AmountSection = ({control, animatedStyle, error}: AmountSectionProps) => {
  const [amount, type] = useWatch({control, name: ['amount', 'type']});

  return (
    <AmountDisplay raw={amount} animatedStyle={animatedStyle} error={error} accent={type === 'income'} />
  );
};
