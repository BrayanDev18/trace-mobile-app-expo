import {View} from 'react-native';

import {Text} from '@/components';

type AuthHeadingProps = {title: string; subtitle: string};

export const AuthHeading = ({title, subtitle}: AuthHeadingProps) => (
  <View className="gap-4 items-center justify-center">
    <Text className="font-satoshi-bold text-4xl tracking-tight">{title}</Text>
    <Text className="text-secundary text-lg text-center">{subtitle}</Text>
  </View>
);
