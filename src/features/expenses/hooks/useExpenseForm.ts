import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {router} from 'expo-router';

import i18next from '@/i18n';
import {getCategory} from '@/constants';
import {haptic} from '@/utils';

import {useMovementsStore} from '../store';
import {suggestedCategory} from '../utils';

const schema = z.object({
  type: z.enum(['expense', 'income']),
  reason: z.string().trim(),
  amount: z
    .string()
    .min(1, {error: () => i18next.t('expenses:validation.amountRequired')})
    .refine((v) => Number(v) > 0, {error: () => i18next.t('expenses:validation.amountInvalid')}),
  date: z.date(),
  categoryId: z.string().min(1, {error: () => i18next.t('expenses:validation.category')}),
  methodId: z.string().optional(),
  budgetId: z.string().optional(),
  receiptUris: z.array(z.string()),
});

export type ExpenseFormValuesProps = z.infer<typeof schema>;

export const useExpenseForm = (initialType: ExpenseFormValuesProps['type'] = 'expense') => {
  const [attempted, setAttempted] = useState(false);
  const addMovement = useMovementsStore((s) => s.add);

  const [initialCategory] = useState(() =>
    suggestedCategory(useMovementsStore.getState().items, initialType),
  );

  const form = useForm<ExpenseFormValuesProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialType,
      reason: '',
      amount: '',
      date: new Date(),
      categoryId: initialCategory,
      methodId: undefined,
      budgetId: undefined,
      receiptUris: [],
    },
  });

  const pickType = (t: ExpenseFormValuesProps['type']) => {
    haptic.select();
    form.setValue('type', t);
    if (t === 'income') form.setValue('budgetId', undefined);
    const currentCategory = form.getValues('categoryId');
    if (currentCategory && getCategory(currentCategory).kind !== t) {
      form.setValue('categoryId', '', {shouldValidate: attempted});
    }
  };

  const submit = (onAmountError: () => void) =>
    form.handleSubmit(
      (data) => {
        addMovement({
          type: data.type,
          reason: data.reason,
          amount: Number(data.amount),
          date: data.date.toISOString(),
          categoryId: data.categoryId,
          methodId: data.methodId,
          budgetId: data.type === 'expense' ? data.budgetId : undefined,
          receiptUris: data.receiptUris.length ? data.receiptUris : undefined,
        });
        haptic.success();
        router.back();
      },
      (errs) => {
        setAttempted(true);
        haptic.error();
        if (errs.amount) onAmountError();
      },
    )();

  return {...form, attempted, pickType, submit};
};
