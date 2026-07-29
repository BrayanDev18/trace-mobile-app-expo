import {ComponentType} from 'react';
import {Pressable} from 'react-native';
import {IconChevronRight} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';

type NavRowProps = {
  icon: ComponentType<{size?: number; color?: string}>;
  label: string;
  onPress: () => void;
  value?: string;
};

export const NavRow = (props: NavRowProps) => {
  const {icon: Icon, label, onPress, value} = props;
  const colors = useIconColors();

  return (
    <Pressable
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
    >
      <Icon size={20} color={colors.muted} />
      <Text className="flex-1 font-satoshi-medium">{label}</Text>
      {value ? (
        <Text className="text-secundary" numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      <IconChevronRight size={18} color={colors.faint} />
    </Pressable>
  );
};