import {View} from 'react-native';

import {Text} from '@/components/Text';

type HeaderProps = {title?: string};

export const Header = ({title}: HeaderProps) => (
  <View className="h-12 items-center justify-center px-14">
    {title ? (
      <Text className="font-satoshi-bold text-lg" numberOfLines={1}>
        {title}
      </Text>
    ) : null}
  </View>
);
