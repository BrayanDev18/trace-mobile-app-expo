import {useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {IconCalendarEvent, IconTargetArrow} from '@tabler/icons-react-native';

import {Input, Keypad, Screen} from '@/components';
import {AmountDisplay,CapturePanel,DatePanel,FormSheetHeader,PickerChip,PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {GOAL_THEMES, getGoalTheme,useGoalForm} from '@/features/goals';
import {haptic, shortDate} from '@/utils';

type Panel = 'keypad' | 'date' | 'theme';

const THEME_OPTIONS = GOAL_THEMES.map((t) => ({id: t.id, label: t.label, icon: t.icon, tint: t.tint}));

export default function NewGoalScreen() {
  const [panel, setPanel] = useState<Panel>('keypad');
  const form = useGoalForm();

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => form.amount,
    onChange: form.setAmount,
  });

  const theme = getGoalTheme(form.themeId);

  const togglePanel = (target: Panel) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen edges={['top']} asBackground={false}>
      <FormSheetHeader title="Nueva meta" onClose={router.back} />

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconTargetArrow}
            defaultValue={form.name}
            onChangeText={form.setName}
            placeholder="¿Para qué ahorras? (Viaje, iPhone…)"
            error={form.attempted && !form.nameValid}
          />
        </View>

        <View className="flex-1 items-center justify-center">
          <AmountDisplay
            raw={form.amount}
            animatedStyle={animatedStyle}
            error={form.attempted && !form.amountValid}
          />
        </View>

        <CapturePanel
          panel={panel}
          submitLabel="Crear meta"
          onSubmit={() => form.submit(shakeError)}
          chips={
            <>
              <PickerChip
                icon={theme.icon}
                label={theme.label}
                tint={theme.tint}
                active={panel === 'theme'}
                onPress={() => togglePanel('theme')}
              />

              <PickerChip
                icon={IconCalendarEvent}
                label={form.deadline ? shortDate(form.deadline) : 'Sin fecha'}
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
                options={THEME_OPTIONS}
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