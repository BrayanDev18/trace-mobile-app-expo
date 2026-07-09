import {Pressable, View, useColorScheme} from 'react-native';
import {IconBackspace} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'erase'],
];

type KeypadProps = {
  onKey: (key: string) => void;
  onErase: () => void;
  onClear?: () => void;
};

export const Keypad = ({onKey, onErase, onClear}: KeypadProps) => {
  const iconColor = useColorScheme() === 'dark' ? '#ffffff' : '#000000';

  return (
    <View className="gap-1">
      {ROWS.map((row) => (
        <View key={row[0]} className="flex-row gap-1">
          {row.map((key) =>
            key === 'erase' ? (
              <Pressable
                key={key}
                accessibilityLabel="Borrar"
                onPressIn={onErase}
                onLongPress={onClear}
                className="h-16 flex-1 items-center justify-center rounded-2xl active:bg-neutral-200 dark:active:bg-white/5"
              >
                <IconBackspace size={26} color={iconColor} />
              </Pressable>
            ) : (
              <Pressable
                key={key}
                onPressIn={() => onKey(key)}
                className="h-16 flex-1 items-center justify-center rounded-2xl active:bg-neutral-200 dark:active:bg-white/5"
              >
                <Text className="font-satoshi-medium text-3xl text-primary">
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
