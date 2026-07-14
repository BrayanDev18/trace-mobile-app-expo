import {Pressable, View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';

import {Keypad} from '@/components/Keypad';
import {Text} from '@/components/Text';
import {AmountDisplay} from '@/components/capture/AmountDisplay';
import {useAmountInput} from '@/hooks/useAmountInput';
import {cn, haptic} from '@/utils';

type AmountEntryPanelProps = {
  raw: string;
  onChangeRaw: (raw: string) => void;
  confirmLabel: string;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
  maxAmount?: number;
};

export const AmountEntryPanel = (props: AmountEntryPanelProps) => {
  const {raw, onChangeRaw, confirmLabel, onConfirm, onCancel, maxAmount} = props;

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => raw,
    onChange: onChangeRaw,
  });

  const value = Number(raw);
  const valid = value > 0 && (maxAmount === undefined || value <= maxAmount);

  const confirm = () => {
    if (!valid) {
      haptic.error();
      shakeError();
      return;
    }
    haptic.success();
    onConfirm(value);
  };

  const cancel = () => {
    haptic.select();
    onCancel();
  };

  return (
    <Animated.View entering={FadeIn.duration(150)} className="gap-4 rounded-3xl bg-secundary p-4">
      <AmountDisplay raw={raw} animatedStyle={animatedStyle} />

      <Keypad onKey={onKey} onErase={erase} onClear={clear} />

      <View className="flex-row gap-3">
        <Pressable
          onPress={cancel}
          className="h-14 flex-1 items-center justify-center rounded-full bg-tertiary active:opacity-70"
        >
          <Text className="font-satoshi-medium">Cancelar</Text>
        </Pressable>

        <Pressable
          onPress={confirm}
          className={cn(
            'h-14 flex-1 items-center justify-center rounded-full btn-primary',
            !valid && 'opacity-40',
          )}
        >
          <Text className="font-satoshi-bold text-white">{confirmLabel}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};