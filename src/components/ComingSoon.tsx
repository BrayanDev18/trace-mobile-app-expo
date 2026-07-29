import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Screen} from '@/components/Screen';
import {Text} from '@/components/Text';

type ComingSoonProps = {
  title: string;
};

export const ComingSoon = ({title}: ComingSoonProps) => {
  const {t} = useTranslation();

  return (
    <Screen edges={['top']} canGoBack={false}>
      <View className="flex-1 items-center justify-center gap-1">
        <Text className="font-satoshi-bold text-2xl tracking-tight">{title}</Text>
        <Text className="text-sm text-secundary">{t('common:states.comingSoon')}</Text>
      </View>
    </Screen>
  );
};
