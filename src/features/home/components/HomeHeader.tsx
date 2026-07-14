import {Pressable, View} from 'react-native';
import {IconBell} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';

type HomeHeaderProps = {
  name?: string;
  onPressBell?: () => void;
};

export const HomeHeader = ({name = 'Brayan', onPressBell}: HomeHeaderProps) => {
  const iconColor = useIconColors().primary;

  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
          <Text className="font-satoshi-bold text-accent dark:text-teal-400">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View>
          <Text className="font-satoshi-bold text-xl">
            Hola, {name}
          </Text>

          <Text className="text-secundary">Sigue el rastro de tu dinero</Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Notificaciones"
        onPress={onPressBell}
        hitSlop={8}
        className="h-12 w-12 items-center justify-center active:opacity-50 bg-secundary rounded-2xl"
      >
        <IconBell size={22} color={iconColor} />
      </Pressable>
    </View>
  );
};
