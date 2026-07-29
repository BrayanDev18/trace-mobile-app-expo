import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconCalendarEvent, IconPigMoney} from '@tabler/icons-react-native';

import {Input, Keypad, Screen, Text} from '@/components';
import {AmountDisplay, CapturePanel, DatePanel, FormSheetHeader, PickerChip, PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {SAVING_THEMES, getSavingTheme, useSavingForm} from '@/features/savings';
import {haptic, shortDate} from '@/utils';

type PanelProps = 'keypad' | 'date' | 'theme';

export default function NewSavingScreen() {
  const {t} = useTranslation();
  const [panel, setPanel] = useState<PanelProps>('keypad');
  const form = useSavingForm();

  const themeOptions = useMemo(
    () =>
      SAVING_THEMES.map((option) => ({
        id: option.id,
        label: t(option.labelKey),
        icon: option.icon,
        tint: option.tint,
      })),
    [t],
  );

  const {animatedStyle, onKey, erase, clear} = useAmountInput({
    getValue: () => form.amount,
    onChange: form.setAmount,
  });

  const theme = getSavingTheme(form.themeId);

  const togglePanel = (target: PanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen safeAreaEdges={['top']} withGlow={false} canGoBack={false}>
      <FormSheetHeader title={t('savings:newSaving')} onClose={router.back} />

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconPigMoney}
            defaultValue={form.name}
            onChangeText={form.setName}
            placeholder={t('savings:form.namePlaceholder')}
            error={form.attempted && !form.nameValid}
          />
        </View>

        <View className="flex-1 items-center justify-center gap-2">
          <AmountDisplay raw={form.amount} animatedStyle={animatedStyle} />
          <Text className="px-8 text-center text-sm text-secundary">{t('savings:form.targetHint')}</Text>
        </View>

        <CapturePanel
          panel={panel}
          submitLabel={t('savings:createSaving')}
          onSubmit={form.submit}
          chips={
            <>
              <PickerChip
                icon={theme.icon}
                label={t(theme.labelKey)}
                tint={theme.tint}
                active={panel === 'theme'}
                onPress={() => togglePanel('theme')}
              />

              <PickerChip
                icon={IconCalendarEvent}
                label={form.deadline ? shortDate(form.deadline) : t('common:states.noDate')}
                active={panel === 'date'}
                onPress={() => togglePanel('date')}
              />
            </>
          }
          panels={{
            keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear} />,
            date: (
              <DatePanel
                selected={form.deadline ?? new Date()}
                onSelect={(d) => {
                  form.setDeadline(d);
                  setPanel('keypad');
                }}
              />
            ),
            theme: (
              <PillPicker
                options={themeOptions}
                selectedId={form.themeId}
                onSelect={(id) => {
                  form.setThemeId(id);
                  setPanel('keypad');
                }}
              />
            ),
          }}
        />
      </View>
    </Screen>
  );
}