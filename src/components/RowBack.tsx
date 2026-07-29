import {Pressable} from 'react-native';
import {useColorScheme} from '@/hooks/useColorScheme';
import {BlurView} from 'expo-blur';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconChevronLeft} from '@tabler/icons-react-native';

import {useIconColors} from '@/hooks/useIconColors';

const BUTTON_SIZE = 44;

type RowBackProps = {onPress?: () => void};

export const RowBack = ({onPress}: RowBackProps) => {
  const {t} = useTranslation();
  const {top} = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const {primary} = useIconColors();

  if (!onPress && !router.canGoBack()) return null;

  return (
    <Pressable
      accessibilityLabel={t('common:ui.back')}
      onPress={onPress ?? router.back}
      hitSlop={8}
      style={{top: top + 2}}
      className="absolute left-3 z-20 active:opacity-70"
    >
      <BlurView
        tint={dark ? 'dark' : 'light'}
        intensity={40}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          overflow: 'hidden',
        }}
      >
        <IconChevronLeft size={22} color={primary} />
      </BlurView>
    </Pressable>
  );
};
