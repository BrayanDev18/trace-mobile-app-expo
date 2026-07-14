import {Pressable, View} from 'react-native';
import {router} from 'expo-router';
import {IconChevronLeft, type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';

type HeaderProps = {
  title?: string;
  leftIcon?: Icon;
  onBack?: () => void;
};

export const Header = (props: HeaderProps) => {
  const {title, leftIcon: LeftIcon = IconChevronLeft, onBack = router.back} = props;

  const iconColor = useIconColors().primary;

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

      <View className="h-10 w-10" />
    </View>
  );
};
