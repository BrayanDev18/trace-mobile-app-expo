import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';
import {weekdaysLong} from '@/utils';

import type {IncomeConfigProps} from '../types';

type CycleProposalCardProps = {
  cycle: IncomeConfigProps;
  onAccept: () => void;
  onDismiss: () => void;
};

export const CycleProposalCard = ({cycle, onAccept, onDismiss}: CycleProposalCardProps) => {
  const {t} = useTranslation();

  const question = {
    weekly: t('income:proposal.weekly', {weekday: weekdaysLong()[cycle.payday] ?? ''}),
    biweekly: t('income:proposal.biweekly', {first: cycle.payday, second: cycle.payday + 15}),
    monthly: t('income:proposal.monthly', {day: cycle.payday}),
  }[cycle.frequency];

  return (
    <View className="gap-2 rounded-2xl bg-secundary p-4">
      <View className="gap-1">
        <Text className="font-satoshi-bold">{question}</Text>
        <Text className="text-sm text-secundary">{t('income:proposal.body')}</Text>
      </View>

      <View className="flex-row justify-end gap-6">
        <Pressable onPress={onDismiss} hitSlop={8} className="px-1 py-2 active:opacity-50">
          <Text className="font-satoshi-medium text-secundary">
            {t('income:proposal.dismiss')}
          </Text>
        </Pressable>

        <Pressable onPress={onAccept} hitSlop={8} className="px-1 py-2 active:opacity-50">
          <Text className="font-satoshi-bold text-accent dark:text-teal-400">
            {t('income:proposal.accept')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
