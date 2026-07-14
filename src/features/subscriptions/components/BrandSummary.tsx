import {Pressable, View} from 'react-native';
import {Image} from 'expo-image';

import {Text} from '@/components/Text';

import type {BrandResult} from '../types';

type BrandSummaryProps = {
  brand: BrandResult;
  onChange: () => void;
};

export const BrandSummary = ({brand, onChange}: BrandSummaryProps) => (
  <View className="flex-row items-center gap-3 rounded-2xl bg-secundary p-3">
    <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-950">
      <Image
        source={{uri: brand.logo_url}}
        style={{width: 42, height: 42, borderRadius: 10}}
        contentFit="contain"
      />
    </View>

    <View className="flex-1">
      <Text className="font-satoshi-bold text-xl">{brand.name}</Text>
      <Text className="text-secundary">{brand.domain}</Text>
    </View>

    <Pressable
      onPress={onChange}
      hitSlop={8}
      className="rounded-xl bg-tertiary px-4 py-2 active:opacity-50"
    >
      <Text className="font-satoshi-medium">Cambiar</Text>
    </Pressable>
  </View>
);