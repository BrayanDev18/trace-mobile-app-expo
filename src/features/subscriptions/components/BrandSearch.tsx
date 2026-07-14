import {useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {Image} from 'expo-image';
import {IconSearch} from '@tabler/icons-react-native';

import {Input} from '@/components/Input';
import {Text} from '@/components/Text';
import {haptic} from '@/utils';

import {useBrandSearch} from '../hooks/useBrandSearch';
import type {BrandResult} from '../types';

type BrandSearchProps = {
  onPick: (brand: BrandResult) => void;
};

export const BrandSearch = ({onPick}: BrandSearchProps) => {
  const [query, setQuery] = useState('');
  const {data, isFetching, error} = useBrandSearch(query);

  const pick = (result: BrandResult) => {
    haptic.select();
    onPick(result);
  };

  return (
    <View className="gap-4 px-5 pt-4">
      <Input
        icon={IconSearch}
        defaultValue={query}
        onChangeText={setQuery}
        placeholder="Busca el servicio (Netflix, Spotify…)"
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isFetching && <ActivityIndicator className="py-4" />}

      {!!error && (
        <Text className="text-center text-sm text-red-400">
          No pudimos buscar. Revisa tu conexión e intenta de nuevo.
        </Text>
      )}

      {!isFetching && data?.length === 0 && query.trim().length >= 2 && (
        <Text className="text-center text-sm text-secundary">Sin resultados</Text>
      )}

      <View className="gap-1">
        {(data ?? []).map((result) => (
          <Pressable
            key={result.domain}
            onPress={() => pick(result)}
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
        ))}
      </View>
    </View>
  );
};