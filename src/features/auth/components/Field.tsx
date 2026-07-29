import type {ReactNode} from 'react';
import {View} from 'react-native';

import {Text} from '@/components';

type FieldProps = {label: string; error?: string; children: ReactNode};

export const Field = ({label, error, children}: FieldProps) => (
  <View className="gap-2">
    <Text className="font-satoshi-medium text-sm text-secundary">{label}</Text>
    {children}
    {error ? <Text className="text-xs text-red-400">{error}</Text> : null}
  </View>
);