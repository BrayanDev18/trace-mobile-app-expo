import {Pressable, View} from 'react-native';
import {Controller, type Control} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {IconCheck} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useIconColors} from '@/hooks/useIconColors';
import {cn, haptic} from '@/utils';

import type {SignUpFormProps} from '../schemas';

type TermsCheckProps = {control: Control<SignUpFormProps>; error?: string};

export const TermsCheck = ({control, error}: TermsCheckProps) => {
  const {t} = useTranslation();
  const {onAccent} = useIconColors();

  return (
    <Controller
      control={control}
      name="terms"
      render={({field: {value, onChange}}) => (
        <View className="gap-2">
          <Pressable
            onPress={() => {
              haptic.select();
              onChange(!value);
            }}
            hitSlop={8}
            accessibilityRole="checkbox"
            accessibilityState={{checked: value}}
            className="flex-row items-center gap-3"
          >
            <View
              className={cn(
                'h-6 w-6 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800',
                value && 'border-0 bg-accent',
                !value && error && 'border-red-400',
              )}
            >
              {value && <IconCheck size={14} color={onAccent} />}
            </View>
            <Text className="flex-1 text-sm text-secundary">{t('auth:ui.terms')}</Text>
          </Pressable>
          {error ? <Text className="text-xs text-red-400">{error}</Text> : null}
        </View>
      )}
    />
  );
};