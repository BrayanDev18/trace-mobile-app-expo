import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IconPaperclip} from '@tabler/icons-react-native';

import {useIconColors} from '@/hooks/useIconColors';

type ReceiptAttachButtonProps = {
  onPress: () => void;
};

export const ReceiptAttachButton = ({onPress}: ReceiptAttachButtonProps) => {
  const {t} = useTranslation();
  const {primary} = useIconColors();

  return (
    <Pressable
      accessibilityLabel={t('expenses:form.addReceipt')}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-neutral-200 active:opacity-70 dark:bg-white/5"
    >
      <IconPaperclip size={18} color={primary} />
    </Pressable>
  );
};
