import {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

export const Group = ({className, children}: {className?: string; children: ReactNode}) => (
  <View
    className={cn('overflow-hidden rounded-2xl bg-secundary', className)}
  >
    {children}
  </View>
);

export const Separator = ({className}: {className?: string}) => (
  <View
    className={cn('ml-4 bg-neutral-200 dark:bg-neutral-800', className)}
    style={{height: StyleSheet.hairlineWidth}}
  />
);

export const Row = ({label, children}: {label: string; children: ReactNode}) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text className="font-satoshi-medium">{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);
