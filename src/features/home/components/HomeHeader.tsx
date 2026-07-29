import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconBell, IconCrownFilled} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';

type HomeHeaderProps = {
  name?: string;
  isOwner?: boolean;
  onPressBell?: () => void;
};

export const HomeHeader = ({name, isOwner, onPressBell}: HomeHeaderProps) => {
  const {t} = useTranslation();
  const iconColor = useIconColors().primary;
  const displayName = name ?? t('home:header.guest');

  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
          <Text className="font-satoshi-bold text-accent dark:text-teal-400">
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View>
          <View className="flex-row items-start">
            <Text className="font-satoshi-bold text-xl">
              {t('home:header.greeting', {name: displayName})}
            </Text>

            {isOwner ? (
              <View className="-ml-1 -mt-1.5 rotate-45">
                <IconCrownFilled size={18} color="#FFD900"/>
              </View>
            ) : null}
          </View>

          <Text className="text-secundary">{t('home:header.tagline')}</Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel={t('home:header.notifications')}
        onPress={onPressBell}
        hitSlop={8}
        className="h-12 w-12 items-center justify-center active:opacity-50 bg-secundary rounded-2xl"
      >
        <IconBell size={22} color={iconColor}/>
      </Pressable>
    </View>
  );
};
