import {useState} from 'react';
import {View} from 'react-native';
import {useWatch} from 'react-hook-form';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconAlignLeft} from '@tabler/icons-react-native';

import {Input, Keypad, Screen} from '@/components';
import {CapturePanel, DatePanel, FormSheetHeader, PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {categoriesByKind, getCategory, getPaymentMethod, PAYMENT_METHODS} from '@/constants';
import {haptic} from '@/utils';

import {useExpenseForm} from '../hooks/useExpenseForm';
import {useReceiptPicker} from '../hooks/useReceiptPicker';
import {type MovementTypeProps} from '../types';
import {AmountSection} from './AmountSection';
import {ExpenseChips, type ExpensePanelProps} from './ExpenseChips';
import {ReceiptAttachButton} from './ReceiptAttachButton';
import {ReceiptGallery} from './ReceiptGallery';

type MovementCaptureProps = {
  type: MovementTypeProps;
};

export const MovementCapture = ({type}: MovementCaptureProps) => {
  const {t} = useTranslation();
  const [panel, setPanel] = useState<ExpensePanelProps>('keypad');
  const methodOptions = PAYMENT_METHODS.map((m) => ({id: m.id, label: t(m.labelKey), icon: m.Icon}));
  const {control, getValues, setValue, formState: {errors}, attempted, submit} = useExpenseForm(type);

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => getValues('amount'),
    onChange: (raw) => setValue('amount', raw, {shouldValidate: attempted}),
  });

  const [date, categoryId, methodId, receiptUris] = useWatch({
    control,
    name: ['date', 'categoryId', 'methodId', 'receiptUris'],
  });

  const category = categoryId ? getCategory(categoryId) : null;
  const method = methodId ? getPaymentMethod(methodId) : undefined;
  const {add, removeAt} = useReceiptPicker(receiptUris, (next) => setValue('receiptUris', next));

  const togglePanel = (target: ExpensePanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen edges={['top']} asBackground={false} canGoBack={false}>
      <FormSheetHeader
        onClose={router.back}
        title={type === 'income' ? t('expenses:new.incomeTitle') : t('expenses:new.expenseTitle')}
        right={<ReceiptAttachButton onPress={add}/>}
      />

      <View className="flex-1 items-center justify-center gap-8">
        <AmountSection control={control} animatedStyle={animatedStyle} error={attempted && !!errors.amount}/>

        <View className="w-full px-20">
          <Input
            control={control}
            name="reason"
            icon={IconAlignLeft}
            placeholder={type === 'expense' ? t('expenses:form.reasonExpense') : t('expenses:form.reasonIncome')}
            returnKeyType="done"
            error={attempted && !!errors.reason}
          />

        </View>

        <ReceiptGallery uris={receiptUris} onRemove={removeAt}/>
      </View>

      <CapturePanel
        panel={panel}
        submitLabel={type === 'income' ? t('expenses:form.submitIncome') : t('expenses:form.submitExpense')}
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
          keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear}/>,
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
              options={categoriesByKind(type).map((c) => ({
                id: c.id,
                label: t(c.labelKey),
                icon: c.icon,
                tint: c.tint
              }))}
              selectedId={categoryId}
              onSelect={(id) => {
                setValue('categoryId', id, {shouldValidate: attempted});
                setPanel('keypad');
              }}
            />
          ),
          method: (
            <PillPicker
              options={methodOptions}
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
};
