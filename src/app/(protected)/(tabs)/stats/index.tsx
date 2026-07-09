import {View} from 'react-native';

import {Screen, Text} from '@/components';

export default function StatsScreen() {
  return (
    <Screen edges={['top']}>
      <View className="flex-1 items-center justify-center gap-1">
        <Text className="font-satoshi-bold text-2xl tracking-tight text-primary">
          Estadísticas
        </Text>
        <Text className="font-satoshi text-sm text-secundary">
          Próximamente
        </Text>
      </View>
    </Screen>
  );
}
