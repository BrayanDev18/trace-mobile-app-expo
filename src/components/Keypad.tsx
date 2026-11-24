import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconBackspace} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['000', '0', 'erase'],
];

type KeypadProps = {
  onKey: (key: string) => void;
  onErase: () => void;
  onClear?: () => void;
};

export const Keypad = ({onKey, onErase, onClear}: KeypadProps) => {
  const {t} = useTranslation();
  const iconColor = useIconColors().primary;

  return (
    <View className="gap-1">
      {ROWS.map((row) => (
        <View key={row[0]} className="flex-row gap-1">
          {row.map((key) =>
            key === 'erase' ? (
              <Pressable
                key={key}
                accessibilityLabel={t('common:ui.erase')}
                onPressIn={onErase}
                onLongPress={onClear}
                className="h-16 flex-1 items-center justify-center rounded-2xl bg-secundary"
              >
                <IconBackspace size={26} color={iconColor} />
              </Pressable>
            ) : (
              <Pressable
                key={key}
                onPressIn={() => onKey(key)}
                className="h-16 flex-1 items-center justify-center rounded-2xl active:bg-neutral-200 dark:active:bg-white/5"
              >
                <Text className="font-satoshi-bold text-2xl">
                  {key}
                </Text>
              </Pressable>
            ),
          )}
        </View>
      ))}
    </View>
  );
};
