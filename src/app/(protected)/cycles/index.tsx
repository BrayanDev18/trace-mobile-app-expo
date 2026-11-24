import {Fragment} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {EmptyState, Group, Header, Screen, Separator, Text} from '@/components';
import {CycleRecapRow, useCycleHistory} from '@/features/income';

export default function CyclesScreen() {
  const {t} = useTranslation();
  const history = useCycleHistory();

  return (
    <Screen preset="scroll">
      <Header title={t('income:history.title')} />

      <View className="gap-2 px-5 pb-10 pt-2">
        {history.length === 0 ? (
          <EmptyState title={t('income:history.emptyTitle')} subtitle={t('income:history.emptyBody')} />
        ) : (
          <>
            <Group>
              {history.map((recap, index) => (
                <Fragment key={recap.cycle.start.toISOString()}>
                  {index > 0 ? <Separator /> : null}
                  <CycleRecapRow recap={recap} />
                </Fragment>
              ))}
            </Group>

            <Text className="px-4 text-xs text-secundary">{t('income:history.footer')}</Text>
          </>
        )}
      </View>
    </Screen>
  );
}
