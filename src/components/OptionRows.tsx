import {Pressable, View} from 'react-native';
import {IconCheck, type Icon} from '@tabler/icons-react-native';

import {Separator} from '@/components/Group';
import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import {haptic} from '@/utils';

type OptionRowItemProps<T extends string> = {
  value: T;
  label: string;
  icon?: Icon;
  tint?: string;
};

type OptionRowsProps<T extends string> = {
  options: OptionRowItemProps<T>[];
  value?: T;
  onSelect: (value: T) => void;
};

export const OptionRows = <T extends string>({options, value, onSelect}: OptionRowsProps<T>) => {
  const accent = useIconColors().accent;

  return (
    <View>
      {options.map((option, index) => {
        const OptionIcon = option.icon;

        return (
          <View key={option.value}>
            {index > 0 ? <Separator /> : null}

            <Pressable
              onPress={() => {
                haptic.select();
                onSelect(option.value);
              }}
              className="min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
            >
              {OptionIcon ? (
                <View
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{backgroundColor: `${option.tint ?? accent}1f`}}
                >
                  <OptionIcon size={17} color={option.tint ?? accent} />
                </View>
              ) : null}

              <Text className="flex-1 font-satoshi-medium">{option.label}</Text>
              {value === option.value ? <IconCheck size={20} color={accent} /> : null}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};
