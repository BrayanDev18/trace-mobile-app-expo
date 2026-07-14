import {View} from 'react-native';

import {PrimaryButton} from '@/components/PrimaryButton';
import {Text} from '@/components/Text';

type EmptyStateProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = (props: EmptyStateProps) => {
  const {title, subtitle, actionLabel, onAction} = props;

  return (
    <View className="w-full items-center gap-3 py-12">
      <Text className="font-satoshi-medium text-xl">{title}</Text>

      <Text className="text-center text-lg text-secundary">{subtitle}</Text>

      {actionLabel ? (
        <PrimaryButton label={actionLabel} onPress={onAction} className="w-full" />
      ) : null}
    </View>
  );
};
