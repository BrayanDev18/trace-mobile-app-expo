import type {ComponentType} from 'react';

import {Chip} from '@/components/Chip';
import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import {cn} from '@/utils';

type PickerChipProps = {
  icon: ComponentType<{size?: number; color?: string}>;
  label: string;
  active: boolean;
  onPress: () => void;
  tint?: string;
  error?: boolean;
};

export const PickerChip = (props: PickerChipProps) => {
  const {icon: ChipIcon, label, active, onPress, tint, error} = props;
  const {muted} = useIconColors();

  return (
    <Chip
      onPress={onPress}
      className={cn(error && 'border border-red-400', active && 'btn-primary')}
      style={!active && tint ? {backgroundColor: `${tint}1f`} : undefined}
    >
      <ChipIcon size={15} color={tint ?? muted} />
      <Text
        className={cn(tint ? 'font-satoshi-bold' : 'font-satoshi-medium', active && 'text-white')}
        style={!active && tint ? {color: tint} : undefined}
      >
        {label}
      </Text>
    </Chip>
  );
};