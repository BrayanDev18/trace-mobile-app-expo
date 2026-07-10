import {ReactNode} from 'react';
import {Pressable} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';

import {cn} from '@/utils';

type ChipProps = {
  onPress: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export const Chip = (props: ChipProps) => {
  const {onPress, className, style, children} = props;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-10 flex-row items-center gap-1.5 rounded-full px-4 active:opacity-70 bg-tertiary',
        className,
      )}
      style={style}
    >
      {children}
    </Pressable>
  );
};
