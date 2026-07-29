import {useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {Image} from 'expo-image';
import {useTranslation} from 'react-i18next';
import {IconSearch} from '@tabler/icons-react-native';

import {Input} from '@/components/Input';
import {Text} from '@/components/Text';
import {haptic} from '@/utils';

import {useBrandSearch} from '../hooks/useBrandSearch';
import {POPULAR_BRANDS} from '../popularBrands';
import type {BrandResultProps} from '../types';

type BrandSearchProps = {
  onPick: (brand: BrandResultProps) => void;
};

export const BrandSearch = ({onPick}: BrandSearchProps) => {
  const {t} = useTranslation();
  const [query, setQuery] = useState('');
  const {data, isFetching, error} = useBrandSearch(query);

  const searching = query.trim().length >= 2;
  const results = searching ? (data ?? []) : POPULAR_BRANDS;

  const pick = (result: BrandResultProps) => {
    haptic.select();
    onPick(result);
  };

  return (
    <View className="gap-4 px-5 pt-4">
      <Input
        icon={IconSearch}
        defaultValue={query}
        onChangeText={setQuery}
        placeholder={t('subscriptions:search.placeholder')}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
      />

      {searching && isFetching && <ActivityIndicator className="py-4" />}

      {searching && !!error && (
        <Text className="text-center text-sm text-red-400">
          {t('subscriptions:search.error')}
        </Text>
      )}

      {searching && !isFetching && data?.length === 0 && (
        <Text className="text-center text-sm text-secundary">{t('subscriptions:search.empty')}</Text>
      )}

      {!searching && (
        <Text className="px-3 text-sm text-secundary font-satoshi-medium">
          {t('subscriptions:search.popular')}
        </Text>
      )}

      <View className="gap-1">
        {results.map((result) => (
          <BrandRow key={result.domain} result={result} onPress={() => pick(result)} />
        ))}
      </View>
    </View>
  );
};

type BrandRowProps = {
  result: BrandResultProps;
  onPress: () => void;
};

const BrandRow = ({result, onPress}: BrandRowProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center gap-3 rounded-2xl px-3 py-2.5 active:bg-neutral-200 dark:active:bg-white/5"
  >
    <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-xl">
      <Image
        source={{uri: result.logo_url}}
        style={{width: 38, height: 38, borderRadius: 9}}
        contentFit="contain"
      />
    </View>

    <View className="flex-1">
      <Text className="font-satoshi-medium">{result.name}</Text>
      <Text className="text-sm text-secundary">{result.domain}</Text>
    </View>
  </Pressable>
);
