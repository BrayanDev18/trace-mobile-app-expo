import {Pressable} from 'react-native';
import {IconPlus, type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import {cn} from '@/utils';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: Icon;
  className?: string;
};

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {label, onPress, icon: LeadingIcon = IconPlus, className} = props;
  const {onAccent} = useIconColors();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary',
        className,
      )}
    >
      <LeadingIcon size={18} color={onAccent} />
      <Text className="font-satoshi-bold text-sm">{label}</Text>
    </Pressable>
  );
};
