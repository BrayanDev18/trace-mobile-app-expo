import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components/Text';
import {Screen} from '@/components/Screen';

type ComingSoonProps = {
  title: string;
};

export const ComingSoon = ({title}: ComingSoonProps) => {
  const {t} = useTranslation();

  return (
    <Screen canGoBack={false}>
      <View className="h-full items-center justify-center gap-1">
        <Text className="font-satoshi-bold text-2xl tracking-tight">{title}</Text>
        <Text className="text-sm text-secundary">{t('common:states.comingSoon')}</Text>
      </View>
    </Screen>
  );
};
