import {useState} from 'react';
import {Keyboard, View} from 'react-native';
import {useWatch} from 'react-hook-form';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconAlignLeft} from '@tabler/icons-react-native';

import {Input, Keypad, Text} from '@/components';
import {CapturePanel, DatePanel, FormSheetHeader, PillPicker} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {selectableCategories, getCategory, getPaymentMethod, PAYMENT_METHODS} from '@/constants';
import {useBudgetsOverview} from '@/features/budgets';
import {formatCurrency, haptic} from '@/utils';

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

  const [date, categoryId, methodId, budgetId, amount, receiptUris] = useWatch({
    control,
    name: ['date', 'categoryId', 'methodId', 'budgetId', 'amount', 'receiptUris'],
  });

  const category = categoryId ? getCategory(categoryId) : null;
  const method = methodId ? getPaymentMethod(methodId) : undefined;
  const budgetsOverview = useBudgetsOverview();
  const budgetRows = type === 'expense' ? (budgetsOverview?.rows ?? []) : [];
  const selectedBudget = budgetId
    ? (budgetRows.find((row) => row.budget.id === budgetId) ?? null)
    : null;
  const noFunds = !!selectedBudget && Number(amount) > selectedBudget.available;
  const {add, removeAt} = useReceiptPicker(receiptUris, (next) => setValue('receiptUris', next));

  const togglePanel = (target: ExpensePanelProps) => {
    haptic.select();
    Keyboard.dismiss();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  const validationMessage = attempted
    ? (errors.amount?.message ?? errors.categoryId?.message)
    : undefined;

  const budgetMessage =
    noFunds && selectedBudget
      ? t('expenses:budget.noFunds', {
          name: selectedBudget.budget.name,
          amount: `$${formatCurrency(selectedBudget.available)}`,
        })
      : undefined;

  const message = validationMessage ?? budgetMessage;

  return (
    <View className="bg-primary h-full w-full gap-10">
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
          />
        </View>

        <View className="h-5 w-full items-center justify-center px-8">
          {message ? (
            <Text numberOfLines={1} className="text-sm text-red-400">
              {message}
            </Text>
          ) : null}
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
            budget={selectedBudget}
            showBudget={budgetRows.length > 0}
            budgetWarning={noFunds}
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
              options={selectableCategories(type).map((c) => ({
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
          budget: (
            <PillPicker
              options={budgetRows.map((row) => ({
                id: row.budget.id,
                label: row.budget.name,
                icon: row.theme.icon,
                tint: row.theme.tint,
              }))}
              selectedId={budgetId}
              onSelect={(id) => {
                setValue('budgetId', id === budgetId ? undefined : id);
                setPanel('keypad');
              }}
            />
          ),
        }}
      />
    </View>
  );
};
