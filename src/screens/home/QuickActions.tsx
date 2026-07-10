import {Pressable, View} from 'react-native';
import {IconDeviceRemote, IconMoneybag, IconTargetArrow, type Icon} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {navigate} from '@/constants';

type QuickAction = {
  label: string;
  icon: Icon;
  onPress?: () => void;
};

const ACTIONS: QuickAction[] = [
  {label: 'Suscriptions', icon: IconDeviceRemote, onPress: () => navigate('subscriptions')},
  {label: 'Goals', icon: IconTargetArrow, onPress: () => navigate('goals')},
  {label: 'Debts', icon: IconMoneybag, onPress: () => navigate('debts')},
];

export const QuickActions = () => (
  <View className="flex-row items-center flex-1 gap-3">
    {ACTIONS.map(({label, icon: ActionIcon, onPress}) => (
      <Pressable
        key={label}
        onPress={onPress}
        disabled={!onPress}
        className="bg-secundary items-center justify-center rounded-2xl flex-1 h-22 gap-1.5 active:opacity-70"
      >
        <ActionIcon color="#a1a1a1" size={23} />
        <Text className="font-satoshi-medium">{label}</Text>
      </Pressable>
    ))}
  </View>
);
