import {useState} from 'react';
import {Pressable} from 'react-native';

import {Text} from '@/components/Text';
import {AmountEntryPanel} from '@/components/capture/AmountEntryPanel';
import {cn, haptic} from '@/utils';

type AmountEntryToggleProps = {
  ctaLabel: string;
  confirmLabel: string;
  onConfirm: (amount: number) => void;
  maxAmount?: number;
  disabled?: boolean;
};

export const AmountEntryToggle = (props: AmountEntryToggleProps) => {
  const {ctaLabel, confirmLabel, onConfirm, maxAmount, disabled} = props;

  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');

  const close = () => {
    setAmount('');
    setAdding(false);
  };

  if (adding) {
    return (
      <AmountEntryPanel
        raw={amount}
        onChangeRaw={setAmount}
        confirmLabel={confirmLabel}
        maxAmount={maxAmount}
        onConfirm={(value) => {
          onConfirm(value);
          close();
        }}
        onCancel={close}
      />
    );
  }

  return (
    <Pressable
      onPress={() => {
        haptic.select();
        setAdding(true);
      }}
      disabled={disabled}
      className={cn(
        'h-14 items-center justify-center rounded-full btn-primary',
        disabled && 'opacity-40',
      )}
    >
      <Text className="font-satoshi-bold text-white">{ctaLabel}</Text>
    </Pressable>
  );
};
