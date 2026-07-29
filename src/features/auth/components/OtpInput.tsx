import {View} from 'react-native';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {cn} from '@/utils';

type OtpInputProps = {value: string; length: number};

export const OtpInput = ({value, length}: OtpInputProps) => {
  const {t} = useTranslation();
  const dark = useColorScheme() === 'dark';

  const boxes = Array.from({length}, (_, index) => value[index] ?? '');
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View
      accessibilityLabel={t('auth:ui.otpAccessibility')}
      className="flex-row justify-center gap-2.5"
    >
      {boxes.map((digit, index) => (
        <View
          key={index}
          className={cn(
            'h-16 w-16 items-center justify-center rounded-2xl bg-secundary',
            index === activeIndex && 'border-2 border-accent',
          )}
          style={dark ? undefined : {boxShadow: '0 1px 6px rgba(0,0,0,0.05)'}}
        >
          <Text className="font-satoshi-bold text-xl">{digit}</Text>
        </View>
      ))}
    </View>
  );
};