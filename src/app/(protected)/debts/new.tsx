import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconCalendarEvent, IconCoin, IconUser, IconWallet} from '@tabler/icons-react-native';

import {Input, Keypad, Screen} from '@/components';
import {
  AmountDisplay,
  CapturePanel,
  DatePanel,
  FormSheetHeader,
  PickerChip,
  PillPicker,
  type PillOptionProps,
  SegmentChips,
} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {useDebtsStore, type DebtDirectionProps, type DebtSourceProps} from '@/features/debts';
import {getSavingTheme, useSavingsStore} from '@/features/savings';
import {haptic, shortDate} from '@/utils';

type PanelProps = 'keypad' | 'date' | 'source';

const DIRECTIONS: DebtDirectionProps[] = ['lent', 'owed'];

export default function NewDebtScreen() {
  const {t} = useTranslation();
  const addDebt = useDebtsStore((s) => s.addDebt);
  const savings = useSavingsStore((s) => s.savings);
  const directions = DIRECTIONS.map((value) => ({value, label: t(`debts:sections.${value}`)}));

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<DebtDirectionProps>('lent');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [source, setSource] = useState('total');
  const [panel, setPanel] = useState<PanelProps>('keypad');
  const [attempted, setAttempted] = useState(false);

  const sourceOptions = useMemo<PillOptionProps[]>(
    () => [
      {id: 'total', label: t('debts:source.total'), icon: IconWallet},
      {id: 'income', label: t('debts:source.income'), icon: IconCoin},
      ...savings
        .filter((s) => !s.archivedAt)
        .map((s) => {
          const theme = getSavingTheme(s.themeId);
          return {id: `saving:${s.id}`, label: s.name, icon: theme.icon, tint: theme.tint};
        }),
    ],
    [savings, t],
  );

  const selectedSource = sourceOptions.find((o) => o.id === source) ?? sourceOptions[0];

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => amount,
    onChange: setAmount,
  });

  const amountValid = Number(amount) > 0;
  const personValid = person.trim().length > 0;

  const togglePanel = (target: PanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  const changeDirection = (value: DebtDirectionProps) => {
    setDirection(value);
    if (value === 'owed' && panel === 'source') setPanel('keypad');
  };

  const resolveSource = (): DebtSourceProps | undefined => {
    if (direction !== 'lent') return undefined;
    if (source === 'income') return {kind: 'income'};
    if (source.startsWith('saving:')) return {kind: 'saving', savingId: source.slice(7)};
    return {kind: 'total'};
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
      source: resolveSource(),
    });
    haptic.success();
    router.back();
  };

  return (
    <Screen edges={['top']} asBackground={false} canGoBack={false}>
      <FormSheetHeader title={t('debts:newDebt')} onClose={router.back} />

      <View className="flex-1 pt-4">
        <View className="px-5">
          <Input
            icon={IconUser}
            defaultValue={person}
            onChangeText={setPerson}
            placeholder={t('debts:form.personPlaceholder')}
            error={attempted && !personValid}
          />
        </View>

        <View className="flex-1 items-center justify-center">
          <AmountDisplay raw={amount} animatedStyle={animatedStyle} error={attempted && !amountValid} />
        </View>

        <CapturePanel
          panel={panel}
          submitLabel={t('debts:form.submit')}
          onSubmit={submit}
          chips={
            <>
              <SegmentChips options={directions} value={direction} onChange={changeDirection} />

              {direction === 'lent' && (
                <PickerChip
                  icon={selectedSource.icon ?? IconWallet}
                  label={selectedSource.label}
                  tint={selectedSource.tint}
                  active={panel === 'source'}
                  onPress={() => togglePanel('source')}
                />
              )}

              <PickerChip
                icon={IconCalendarEvent}
                label={dueDate ? shortDate(dueDate) : t('common:states.noDate')}
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
            source: (
              <PillPicker
                options={sourceOptions}
                selectedId={source}
                onSelect={(id) => {
                  setSource(id);
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
