import {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

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
