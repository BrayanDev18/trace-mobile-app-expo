import {useState} from 'react';
import {View} from 'react-native';
import {useWatch} from 'react-hook-form';
import {router} from 'expo-router';
import {IconAlignLeft} from '@tabler/icons-react-native';

import {Input, Keypad, Screen} from '@/components';
import {CapturePanel,DatePanel,FormSheetHeader,PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {categoriesByKind, getCategory, getPaymentMethod, PAYMENT_METHODS} from '@/constants';
import {AmountSection,ReceiptControl,TypeSwitch,useExpenseForm} from '@/features/expenses';
import {ExpenseChips, type ExpensePanelProps} from '@/features/expenses';
import {haptic} from '@/utils';

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({id: m.id, label: m.label, icon: m.Icon}));

export default function NewExpenseScreen() {
  const [panel, setPanel] = useState<ExpensePanelProps>('keypad');
  const {control, getValues, setValue, formState: {errors}, attempted, pickType, submit} = useExpenseForm();

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => getValues('amount'),
    onChange: (raw) => setValue('amount', raw, {shouldValidate: attempted}),
  });

  const [type, date, categoryId, methodId, receiptUri] = useWatch({
    control,
    name: ['type', 'date', 'categoryId', 'methodId', 'receiptUri'],
  });

  const category = categoryId ? getCategory(categoryId) : null;
  const method = methodId ? getPaymentMethod(methodId) : undefined;

  const togglePanel = (target: ExpensePanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen edges={['top']} asBackground={false}>
      <FormSheetHeader
        onClose={router.back}
        title={<TypeSwitch value={type} onChange={pickType} />}
        right={<ReceiptControl uri={receiptUri} onChange={(uri) => setValue('receiptUri', uri)} />}
      />

      <View className="flex-1 items-center justify-center gap-8">
        <AmountSection control={control} animatedStyle={animatedStyle} error={attempted && !!errors.amount} />

        <View className="w-full px-20">
          <Input
            control={control}
            name="reason"
            icon={IconAlignLeft}
            placeholder={type === 'expense' ? '¿En qué fue?' : '¿De dónde vino?'}
            returnKeyType="done"
            error={attempted && !!errors.reason}
          />
        </View>
      </View>

      <CapturePanel
        panel={panel}
        submitLabel={type === 'income' ? 'Agregar ingreso' : 'Agregar gasto'}
        onSubmit={() => submit(shakeError)}
        chips={
          <ExpenseChips
            panel={panel}
            date={date}
            category={category}
            method={method}
            categoryError={attempted && !!errors.categoryId}
            onToggle={togglePanel}
          />
        }
        panels={{
          keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear} />,
          date: (
            <DatePanel
              selected={date}
              onSelect={(d) => {
                setValue('date', d);
                setPanel('keypad');
              }}
            />
          ),
          category: (
            <PillPicker
              options={categoriesByKind(type).map((c) => ({id: c.id, label: c.label, icon: c.icon, tint: c.tint}))}
              selectedId={categoryId}
              onSelect={(id) => {
                setValue('categoryId', id, {shouldValidate: attempted});
                setPanel('keypad');
              }}
            />
          ),
          method: (
            <PillPicker
              options={METHOD_OPTIONS}
              selectedId={methodId}
              onSelect={(id) => {
                setValue('methodId', id);
                setPanel('keypad');
              }}
            />
          ),
        }}
      />
    </Screen>
  );
}
