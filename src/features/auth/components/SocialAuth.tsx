import type {ComponentProps} from 'react';
import {Pressable, View} from 'react-native';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useTranslation} from 'react-i18next';
import {Image} from 'expo-image';

import {Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';

type SocialAuthProps = {onPress: () => void};

export const SocialAuth = ({onPress}: SocialAuthProps) => {
  const {t} = useTranslation();
  const {primary} = useIconColors();

  return (
    <View className="gap-8">
      <View className="flex-row gap-3">
        <ProviderButton
          icon={require('@assets/icons/google-icon.svg')}
          label={t('auth:ui.google')}
          onPress={onPress}
        />
        <ProviderButton
          icon={require('@assets/icons/apple-icon.svg')}
          tint={primary}
          label={t('auth:ui.apple')}
          onPress={onPress}
        />
      </View>

      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <Text className="text-secundary font-satoshi-medium">{t('auth:ui.or')}</Text>
        <View className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </View>
    </View>
  );
};

type ProviderButtonProps = {
  icon: ComponentProps<typeof Image>['source'];
  label: string;
  onPress: () => void;
  tint?: string;
};

const ProviderButton = (props: ProviderButtonProps) => {
  const {icon, label, onPress, tint} = props;
  const dark = useColorScheme() === 'dark';

  return (
    <Pressable
      onPress={onPress}
      className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-secundary active:opacity-70"
      style={dark ? undefined : {boxShadow: '0 1px 6px rgba(0,0,0,0.05)'}}
    >
      <Image source={icon} tintColor={tint} style={{width: 18, height: 18}} />
      <Text className="font-satoshi-medium text-sm">{label}</Text>
    </Pressable>
  );
};
