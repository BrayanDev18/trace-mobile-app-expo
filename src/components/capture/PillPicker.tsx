import type {ComponentType} from 'react';
import {Pressable, View} from 'react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import {cn, haptic} from '@/utils';

export type PillOption = {
  id: string;
  label: string;
  icon?: ComponentType<{size?: number; color?: string}>;
  tint?: string;
};

type PillPickerProps = {
  options: PillOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export const PillPicker = ({options, selectedId, onSelect}: PillPickerProps) => {
  const {muted} = useIconColors();

  return (
    <View className="flex-row flex-wrap justify-center gap-4">
      {options.map((option) => {
        const active = option.id === selectedId;
        const OptionIcon = option.icon;

        return (
          <Pressable
            key={option.id}
            onPress={() => {
              haptic.select();
              onSelect(option.id);
            }}
            className={cn(
              'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70',
              !active && 'border-neutral-200 bg-secundary dark:border-neutral-800',
              active && !option.tint && 'border-transparent btn-primary',
            )}
            style={
              active && option.tint
                ? {backgroundColor: `${option.tint}1f`, borderColor: `${option.tint}66`}
                : undefined
            }
          >
            {OptionIcon ? <OptionIcon size={16} color={option.tint ?? muted} /> : null}
            <Text
              className={cn(
                active ? 'font-satoshi-bold' : 'font-satoshi-medium',
                active && !option.tint && 'text-white',
              )}
              style={active && option.tint ? {color: option.tint} : undefined}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};