import {Pressable, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  IconDeviceRemote,
  IconMoneybagMoveBack,
  IconMoneybagPlus,
  IconPigMoney,
  IconWallet,
  type Icon,
} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {navigate} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';

type QuickActionProps = {
  labelKey: string;
  icon: Icon;
  onPress?: () => void;
};

const ACTIONS: QuickActionProps[] = [
  {labelKey: 'income', icon: IconMoneybagPlus, onPress: () => navigate('newIncome')},
  {labelKey: 'budgets', icon: IconWallet, onPress: () => navigate('budgets')},
  {labelKey: 'subscriptions', icon: IconDeviceRemote, onPress: () => navigate('subscriptions')},
  {labelKey: 'savings', icon: IconPigMoney, onPress: () => navigate('savings')},
  {labelKey: 'debts', icon: IconMoneybagMoveBack, onPress: () => navigate('debts')},
];

export const QuickActions = () => {
  const {t} = useTranslation();
  const {muted} = useIconColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap: 12}}
    >
      {ACTIONS.map(({labelKey, icon: ActionIcon, onPress}) => (
        <Pressable
          key={labelKey}
          onPress={onPress}
          disabled={!onPress}
          className="bg-secundary items-center justify-center rounded-2xl w-28 h-22 gap-1.5 active:opacity-70"
        >
          <ActionIcon color={muted} size={23} />
          <Text className="font-satoshi-medium">{t(`home:quickActions.${labelKey}`)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};
