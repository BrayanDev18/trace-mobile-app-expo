import {useState} from 'react';
import {Pressable} from 'react-native';
import type {FieldValues} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {IconEye, IconEyeOff, IconLock} from '@tabler/icons-react-native';

import {Input, type InputProps} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';
import {haptic} from '@/utils';

export const PasswordInput = <T extends FieldValues = FieldValues>(props: InputProps<T>) => {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const {faint} = useIconColors();

  const EyeIcon = visible ? IconEyeOff : IconEye;

  const toggle = () => {
    haptic.select();
    setVisible((prev) => !prev);
  };

  return (
    <Input
      icon={IconLock}
      secureTextEntry={!visible}
      autoCapitalize="none"
      trailing={
        <Pressable
          onPress={toggle}
          hitSlop={12}
          accessibilityLabel={visible ? t('auth:ui.hidePassword') : t('auth:ui.showPassword')}
        >
          <EyeIcon size={18} color={faint} />
        </Pressable>
      }
      {...props}
    />
  );
};