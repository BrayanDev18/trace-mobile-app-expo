import {Pressable, View, useColorScheme} from 'react-native';
import {router} from 'expo-router';
import {IconChevronLeft, type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';

type HeaderProps = {
  title?: string;
  leftIcon?: Icon;
  rightIcon?: Icon;
  onBack?: () => void;
  onPress?: () => void;
};


export const Header = (props: HeaderProps) => {
  const {
    title,
    leftIcon: LeftIcon = IconChevronLeft,
    rightIcon: RightIcon,
    onBack = router.back,
    onPress,
  } = props;

  const iconColor = useColorScheme() === 'dark' ? '#ffffff' : '#000000';

  return (
    <View className="h-12 flex-row items-center justify-between px-3">
      <Pressable
        accessibilityLabel="Volver"
        onPress={onBack}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center active:opacity-50"
      >
        <LeftIcon size={26} color={iconColor} />
      </Pressable>

      {title ? <Text className="font-satoshi-bold text-lg">{title}</Text> : null}

      {RightIcon ? (
        <Pressable
          onPress={onPress}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center active:opacity-50"
        >
          <RightIcon size={24} color={iconColor} />
        </Pressable>
      ) : (
        <View className="h-10 w-10" />
      )}
    </View>
  );
};
