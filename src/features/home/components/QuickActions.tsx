import {Pressable, View} from 'react-native';
import {IconDeviceRemote, IconMoneybag, IconTargetArrow, type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {navigate} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';

type QuickActionProps = {
  label: string;
  icon: Icon;
  onPress?: () => void;
};

const ACTIONS: QuickActionProps[] = [
  {label: 'Suscripciones', icon: IconDeviceRemote, onPress: () => navigate('subscriptions')},
  {label: 'Metas', icon: IconTargetArrow, onPress: () => navigate('goals')},
  {label: 'Deudas', icon: IconMoneybag, onPress: () => navigate('debts')},
];

export const QuickActions = () => {
  const {muted} = useIconColors();

  return (
    <View className="flex-row items-center flex-1 gap-3">
      {ACTIONS.map(({label, icon: ActionIcon, onPress}) => (
        <Pressable
          key={label}
          onPress={onPress}
          disabled={!onPress}
          className="bg-secundary items-center justify-center rounded-2xl flex-1 h-22 gap-1.5 active:opacity-70"
        >
          <ActionIcon color={muted} size={23} />
          <Text className="font-satoshi-medium">{label}</Text>
        </Pressable>
      ))}
    </View>
  );
};