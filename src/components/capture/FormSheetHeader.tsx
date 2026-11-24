import {ReactNode} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconX} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';

type FormSheetHeaderProps = {
  title?: ReactNode;
  onClose: () => void;
  right?: ReactNode;
};

export const FormSheetHeader = ({title, onClose, right}: FormSheetHeaderProps) => {
  const {t} = useTranslation();
  const {primary} = useIconColors();

  return (
    <View className="flex-row items-center justify-between px-5 pt-6">
      <Pressable
        accessibilityLabel={t('common:actions.close')}
        onPress={onClose}
        hitSlop={8}
        className="h-12 w-12 items-center justify-center rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
      >
        <IconX size={18} color={primary} />
      </Pressable>

      {typeof title === 'string' ? <Text className="font-satoshi-bold text-lg">{title}</Text> : title}

      {right ?? <View className="h-10 w-10" />}
    </View>
  );
};
