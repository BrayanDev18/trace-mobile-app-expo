import {useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {IconCalendarEvent, IconUser} from '@tabler/icons-react-native';

import {Input, Keypad, Screen} from '@/components';
import {AmountDisplay,CapturePanel,DatePanel,FormSheetHeader,PickerChip,SegmentChips} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {useDebtsStore, type DebtDirection} from '@/features/debts';
import {haptic, shortDate} from '@/utils';

type Panel = 'keypad' | 'date';

const DIRECTIONS: {value: DebtDirection; label: string}[] = [
  {value: 'lent', label: 'Me deben'},
  {value: 'owed', label: 'Yo debo'},
];

export default function NewDebtScreen() {
  const addDebt = useDebtsStore((s) => s.addDebt);

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<DebtDirection>('lent');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [panel, setPanel] = useState<Panel>('keypad');
  const [attempted, setAttempted] = useState(false);

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => amount,
    onChange: setAmount,
  });

  const amountValid = Number(amount) > 0;
  const personValid = person.trim().length > 0;

  const togglePanel = (target: Panel) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  const submit = () => {
    if (!personValid || !amountValid) {
      setAttempted(true);
      haptic.error();
      if (!amountValid) shakeError();
      return;
    }
    addDebt({
      direction,
      person: person.trim(),
      amount: Number(amount),
      dueDate: dueDate?.toISOString(),
    });
    haptic.success();
    router.back();
  };

  return (
    <Screen edges={['top']} asBackground={false}>
      <FormSheetHeader title="Nueva deuda" onClose={router.back} />

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconUser}
            defaultValue={person}
            onChangeText={setPerson}
            placeholder="¿Con quién? (Ana, Carlos…)"
            error={attempted && !personValid}
          />
        </View>

        <View className="flex-1 items-center justify-center">
          <AmountDisplay raw={amount} animatedStyle={animatedStyle} error={attempted && !amountValid} />
        </View>

        <CapturePanel
          panel={panel}
          submitLabel="Registrar deuda"
          onSubmit={submit}
          chips={
            <>
              <SegmentChips options={DIRECTIONS} value={direction} onChange={setDirection} />

              <PickerChip
                icon={IconCalendarEvent}
                label={dueDate ? shortDate(dueDate) : 'Sin fecha'}
                active={panel === 'date'}
                onPress={() => togglePanel('date')}
              />
            </>
          }
          panels={{
            keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear} />,
            date: (
              <DatePanel
                selected={dueDate ?? new Date()}
                onSelect={(d) => {
                  setDueDate(d);
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
