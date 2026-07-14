import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {IconPaperclip} from '@tabler/icons-react-native';

import {SheetModal} from '@/components/SheetModal';
import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';

type ReceiptControlProps = {
  uri?: string;
  onChange: (uri?: string) => void;
};

export const ReceiptControl = ({uri, onChange}: ReceiptControlProps) => {
  const [open, setOpen] = useState(false);
  const {primary} = useIconColors();

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality: 0.7});
    if (!result.canceled) {
      onChange(result.assets[0].uri);
      setOpen(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Factura"
        onPress={() => (uri ? setOpen(true) : pick())}
        className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
      >
        {uri ? (
          <Image source={{uri}} style={{width: 40, height: 40}} contentFit="cover" />
        ) : (
          <IconPaperclip size={18} color={primary} />
        )}
      </Pressable>

      <SheetModal visible={open} onClose={() => setOpen(false)} title="Factura">
        {uri ? (
          <Image
            source={{uri}}
            style={{width: '100%', height: 280, borderRadius: 20}}
            contentFit="cover"
          />
        ) : null}

        <View className="flex-row gap-3">
          <Pressable
            onPress={pick}
            className="flex-1 items-center rounded-2xl border border-neutral-200 py-3.5 active:opacity-70 dark:border-neutral-800"
          >
            <Text className="font-satoshi-medium text-sm">Cambiar</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onChange(undefined);
              setOpen(false);
            }}
            className="flex-1 items-center rounded-2xl bg-red-500/10 py-3.5 active:opacity-70"
          >
            <Text className="font-satoshi-medium text-sm text-red-400">Quitar</Text>
          </Pressable>
        </View>
      </SheetModal>
    </>
  );
};