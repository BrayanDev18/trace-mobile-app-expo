import {Pressable, View} from 'react-native';

import {Group} from '@/components/Group';
import {Text} from '@/components/Text';
import {cn} from '@/utils';

type GroupActionProps = {
  label: string;
  caption: string;
  onPress: () => void;
  destructive?: boolean;
};

export const GroupAction = (props: GroupActionProps) => {
  const {label, caption, onPress, destructive} = props;

  return (
    <View className="gap-2">
      <Group>
        <Pressable
          onPress={onPress}
          className="min-h-14 items-center justify-center px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
        >
          <Text
            className={cn(
              'font-satoshi-medium text-lg',
              destructive ? 'text-red-400' : 'text-accent dark:text-teal-400',
            )}
          >
            {label}
          </Text>
        </Pressable>
      </Group>

      <Text className="px-4 text-xs text-secundary">{caption}</Text>
    </View>
  );
};
