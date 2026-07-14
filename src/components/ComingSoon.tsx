import {View} from 'react-native';

import {Screen} from '@/components/Screen';
import {Text} from '@/components/Text';

type ComingSoonProps = {
  title: string;
};

export const ComingSoon = ({title}: ComingSoonProps) => (
  <Screen edges={['top']}>
    <View className="flex-1 items-center justify-center gap-1">
      <Text className="font-satoshi-bold text-2xl tracking-tight">{title}</Text>
      <Text className="text-sm text-secundary">Próximamente</Text>
    </View>
  </Screen>
);
