import {ReactNode} from 'react';
import {Modal, Pressable, View, useColorScheme} from 'react-native';
import {IconX} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';

type SheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export const SheetModal = (props: SheetModalProps) => {
  const {visible, onClose, title, children} = props;

  const iconColor = useColorScheme() === 'dark' ? '#ffffff' : '#000000';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-end"
        style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-secundary rounded-t-3xl px-5 pt-4 pb-10 gap-4"
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-satoshi-bold text-lg tracking-tight">
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="w-8 h-8 rounded-full items-center justify-center bg-neutral-200 dark:bg-white/5"
            >
              <IconX size={16} color={iconColor} />
            </Pressable>
          </View>

          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
