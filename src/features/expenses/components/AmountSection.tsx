import {useWatch, type Control} from 'react-hook-form';
import type {StyleProp, ViewStyle} from 'react-native';
import type {AnimatedStyle} from 'react-native-reanimated';

import {AmountDisplay} from '@/components/capture';

import {type ExpenseFormValues} from '../hooks/useExpenseForm';

type AmountSectionProps = {
  control: Control<ExpenseFormValues>;
  animatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  error: boolean;
};

/** Observa solo `amount`/`type`: el pop de cada tecla no re-renderiza la pantalla. */
export const AmountSection = ({control, animatedStyle, error}: AmountSectionProps) => {
  const [amount, type] = useWatch({control, name: ['amount', 'type']});

  return (
    <AmountDisplay raw={amount} animatedStyle={animatedStyle} error={error} accent={type === 'income'} />
  );
};
