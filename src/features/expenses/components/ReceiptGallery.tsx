import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Image} from 'expo-image';

import {SheetModal, Text} from '@/components';

type ReceiptGalleryProps = {
  uris: string[];
  onRemove: (index: number) => void;
};

export const ReceiptGallery = ({uris, onRemove}: ReceiptGalleryProps) => {
  const {t} = useTranslation();
  const [active, setActive] = useState<number | null>(null);

  if (!uris.length) return null;

  return (
    <>
      <View className="mt-5 flex-row flex-wrap justify-center gap-2">
        {uris.map((uri, index) => (
          <Pressable
            key={uri}
            accessibilityLabel={t('expenses:detail.viewReceipt')}
            onPress={() => setActive(index)}
            className="overflow-hidden rounded-xl active:opacity-70"
          >
            <Image source={{uri}} style={{width: 52, height: 52}} contentFit="cover" />
          </Pressable>
        ))}
      </View>

      <SheetModal visible={active !== null} onClose={() => setActive(null)} title={t('expenses:detail.receipt')}>
        {active !== null ? (
          <Image
            source={{uri: uris[active]}}
            style={{width: '100%', height: 280, borderRadius: 20}}
            contentFit="cover"
          />
        ) : null}

        <Pressable
          onPress={() => {
            if (active !== null) onRemove(active);
            setActive(null);
          }}
          className="items-center rounded-2xl bg-red-500/10 py-3.5 active:opacity-70"
        >
          <Text className="font-satoshi-medium text-sm text-red-400">{t('common:actions.remove')}</Text>
        </Pressable>
      </SheetModal>
    </>
  );
};
