import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {router} from 'expo-router';

import {getCategory} from '@/constants';
import {haptic} from '@/utils';

import {useMovementsStore} from '../store';

const schema = z.object({
  type: z.enum(['expense', 'income']),
  reason: z.string().trim().min(1, 'Ingresa una razón'),
  amount: z.string().min(1, 'Ingresa un monto').refine((v) => Number(v) > 0, 'Monto inválido'),
  date: z.date(),
  categoryId: z.string().min(1, 'Elige una categoría'),
  methodId: z.string().optional(),
  receiptUri: z.string().optional(),
});

export type ExpenseFormValuesProps = z.infer<typeof schema>;

export const useExpenseForm = () => {
  const [attempted, setAttempted] = useState(false);
  const addMovement = useMovementsStore((s) => s.add);

  const form = useForm<ExpenseFormValuesProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      reason: '',
      amount: '',
      date: new Date(),
      categoryId: '',
      methodId: undefined,
      receiptUri: undefined,
    },
  });

  const pickType = (t: ExpenseFormValuesProps['type']) => {
    haptic.select();
    form.setValue('type', t);
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
          receiptUri: data.receiptUri,
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
