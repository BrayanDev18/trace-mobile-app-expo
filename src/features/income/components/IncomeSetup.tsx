import {useRef, useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import {KeyboardToolbar} from 'react-native-keyboard-controller';
import {useTranslation} from 'react-i18next';
import {IconCalendarMonth, IconRepeat} from '@tabler/icons-react-native';

import {Button, Group, NavRow, OptionRows, Screen, Separator, SheetModal, Text} from '@/components';
import {AmountDisplay} from '@/components/capture';
import {capitalize, weekdaysLong, weekdaysShort} from '@/utils';

import {useIncomeForm} from '../hooks/useIncomeForm';
import type {PayFrequencyProps} from '../types';
import {DayGrid} from './DayGrid';

type SheetProps = 'frequency' | 'payday';

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const IncomeSetup = () => {
  const {t} = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [sheet, setSheet] = useState<SheetProps | null>(null);
  const form = useIncomeForm();

  const openSheet = (target: SheetProps) => {
    inputRef.current?.blur();
    setSheet(target);
  };

  const closeSheet = () => setSheet(null);

  const paydayValue = {
    weekly: capitalize(weekdaysLong()[form.payday] ?? ''),
    biweekly: t('income:setup.paydayBiweekly', {first: form.payday, second: form.payday + 15}),
    monthly: t('income:setup.paydayValue', {day: form.payday}),
  }[form.frequency];

  const paydayOptions = {
    weekly: WEEKDAY_ORDER.map((value) => ({value, label: weekdaysShort()[value]})),
    biweekly: Array.from({length: 15}, (_, index) => ({
      value: index + 1,
      label: String(index + 1),
    })),
    monthly: Array.from({length: 31}, (_, index) => ({
      value: index + 1,
      label: String(index + 1),
    })),
  }[form.frequency];

  return (
    <>
      <Screen canGoBack={false}>
        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
          <Text className="font-satoshi-bold text-lg tracking-tight">{t('income:setup.title')}</Text>

          <Pressable onPress={form.skip} hitSlop={8} className="active:opacity-50">
            <Text className="font-satoshi-medium text-secundary">
              {form.isEditing ? t('common:actions.cancel') : t('income:setup.skip')}
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center gap-3 px-5">
          <AmountDisplay raw={form.amount} animatedStyle={form.animatedStyle} />
          <Text className="px-8 text-center text-sm text-secundary">
            {t('income:setup.subtitle')}
          </Text>

          <TextInput
            ref={inputRef}
            value={form.amount}
            onChangeText={form.onAmountText}
            keyboardType="decimal-pad"
            autoFocus
            caretHidden
            accessibilityLabel={t('income:setup.title')}
            className="absolute inset-0 opacity-0"
          />
        </View>

        <View className="gap-6 px-5 pb-4">
          <View className="gap-2">
            <Group>
              <NavRow
                icon={IconRepeat}
                label={t('income:setup.frequencyLabel')}
                value={t(`income:frequency.${form.frequency}`)}
                onPress={() => openSheet('frequency')}
              />
              <Separator />
              <NavRow
                icon={IconCalendarMonth}
                label={t('income:setup.paydayLabel')}
                value={paydayValue}
                onPress={() => openSheet('payday')}
              />
            </Group>

            <Text className="px-4 text-xs text-secundary">{t('income:setup.footer')}</Text>
          </View>

          <Button label={t('common:actions.save')} onPress={form.save} />
        </View>

        <SheetModal
          visible={sheet === 'frequency'}
          onClose={closeSheet}
          title={t('income:setup.frequencyLabel')}
        >
          <OptionRows
            options={[
              {value: 'weekly', label: t('income:frequency.weekly')},
              {value: 'biweekly', label: t('income:frequency.biweekly')},
              {value: 'monthly', label: t('income:frequency.monthly')},
            ]}
            value={form.frequency}
            onSelect={(value: PayFrequencyProps) => {
              form.setFrequency(value);
              closeSheet();
            }}
          />
        </SheetModal>

        <SheetModal
          visible={sheet === 'payday'}
          onClose={closeSheet}
          title={t('income:setup.paydayLabel')}
        >
          <View className="gap-4">
            {form.frequency === 'biweekly' ? (
              <Text className="px-2 text-sm text-secundary">
                {t('income:setup.paydayHintBiweekly')}
              </Text>
            ) : null}

            <DayGrid
              options={paydayOptions}
              value={form.payday}
              onSelect={(day) => {
                form.setPayday(day);
                closeSheet();
              }}
            />
          </View>
        </SheetModal>
      </Screen>

      <KeyboardToolbar>
        <KeyboardToolbar.Done text={t('common:actions.done')} />
      </KeyboardToolbar>
    </>
  );
};
