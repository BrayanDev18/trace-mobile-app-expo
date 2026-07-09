import {View} from 'react-native';

import {Screen, Text} from '@/components';

export default function WalletScreen() {
  return (
    <Screen edges={['top']}>
      <View className="flex-1 items-center justify-center gap-1">
        <Text className="font-satoshi-bold text-2xl tracking-tight text-primary">
          Cartera
        </Text>
        <Text className="font-satoshi text-sm text-secundary">
          Próximamente
        </Text>
      </View>
    </Screen>
  );
}
