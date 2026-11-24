import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconWallet} from '@tabler/icons-react-native';

import {Input, Keypad, Text} from '@/components';
import {AmountDisplay, CapturePanel, FormSheetHeader, PickerChip, PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {BUDGET_THEMES, getBudgetTheme, useBudgetForm} from '@/features/budgets';
import {haptic} from '@/utils';

type PanelProps = 'keypad' | 'theme';

export default function NewBudgetScreen() {
  const {t} = useTranslation();
  const [panel, setPanel] = useState<PanelProps>('keypad');
  const form = useBudgetForm();

  const themeOptions = useMemo(
    () =>
      BUDGET_THEMES.map((option) => ({
        id: option.id,
        label: t(option.labelKey),
        icon: option.icon,
        tint: option.tint,
      })),
    [t],
  );

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => form.amount,
    onChange: form.setAmount,
  });

  const theme = getBudgetTheme(form.themeId);

  const togglePanel = (target: PanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <View className="bg-primary h-full w-full gap-10">
      <FormSheetHeader title={t('budgets:newBudget')} onClose={router.back} />

      <View className="flex-1">
        <View className="px-5">
          <Input
            icon={IconWallet}
            defaultValue={form.name}
            onChangeText={form.setName}
            placeholder={t('budgets:form.namePlaceholder')}
            error={form.attempted && !form.nameValid}
          />
        </View>

        <View className="flex-1 items-center justify-center gap-2">
          <AmountDisplay raw={form.amount} animatedStyle={animatedStyle} />
          <Text className="px-8 text-center text-sm text-secundary">{t('budgets:form.assignedHint')}</Text>
        </View>

        <CapturePanel
          panel={panel}
          submitLabel={t('budgets:createBudget')}
          onSubmit={() => form.submit(shakeError)}
          chips={
            <PickerChip
              icon={theme.icon}
              label={t(theme.labelKey)}
              tint={theme.tint}
              active={panel === 'theme'}
              onPress={() => togglePanel('theme')}
            />
          }
          panels={{
            keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear} />,
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
    </View>
  );
}
