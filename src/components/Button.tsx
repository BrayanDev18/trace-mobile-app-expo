import {Pressable} from 'react-native';
import {type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import {cn} from '@/utils';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: Icon | null;
  className?: string;
};

export const Button = (props: ButtonProps) => {
  const {label, onPress, icon: LeadingIcon, className} = props;
  const {onAccent} = useIconColors();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary',
        className,
      )}
    >
      {LeadingIcon && <LeadingIcon size={18} color={onAccent}/>}
      <Text numberOfLines={1} className="font-satoshi-bold">
        {label}
      </Text>
    </Pressable>
  );
};
