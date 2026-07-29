import {Pressable, View} from 'react-native';

import {Text} from '@/components';

type AuthSwitchLinkProps = {question: string; action: string; onPress: () => void};

export const AuthSwitchLink = ({question, action, onPress}: AuthSwitchLinkProps) => (
  <View className="flex-row items-center justify-center gap-1.5">
    <Text className="text-secundary">{question}</Text>

    <Pressable onPress={onPress} hitSlop={12} className="active:opacity-70">
      <Text className="font-satoshi-bold">{action}</Text>
    </Pressable>
  </View>
);