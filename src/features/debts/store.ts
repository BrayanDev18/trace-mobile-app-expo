import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {sumByKey} from '@/utils';

import type {DebtProps, DebtPaymentProps} from './types';

type DebtsStateProps = {
  debts: DebtProps[];
  payments: DebtPaymentProps[];
  addDebt: (data: Omit<DebtProps, 'id' | 'createdAt'>) => void;
  settleDebt: (id: string) => void;
  addPayment: (data: Omit<DebtPaymentProps, 'id' | 'date'>) => void;
  removePayment: (id: string) => void;
  clear: () => void;
};

export const useDebtsStore = create<DebtsStateProps>()(
  persist(
    (set) => ({
      debts: [],
      payments: [],
      addDebt: (data) =>
        set((state) => ({
          debts: [
            {...data, id: String(Date.now()), createdAt: new Date().toISOString()},
            ...state.debts,
          ],
        })),
      settleDebt: (id) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? {...d, settledAt: new Date().toISOString()} : d,
          ),
        })),
      addPayment: (data) =>
        set((state) => ({
          payments: [
            {...data, id: String(Date.now()), date: new Date().toISOString()},
            ...state.payments,
          ],
        })),
      removePayment: (id) =>
        set((state) => ({payments: state.payments.filter((p) => p.id !== id)})),
      clear: () => set({debts: [], payments: []}),
    }),
    {
      name: 'trace-debts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({debts: state.debts, payments: state.payments}),
    },
  ),
);

export const debtPaid = (payments: DebtPaymentProps[], debtId: string) =>
  sumByKey(payments, 'debtId', debtId);

export const outstandingFromSaving = (
  debts: DebtProps[],
  payments: DebtPaymentProps[],
  savingId: string,
) =>
  debts.reduce((sum, debt) => {
    if (debt.direction !== 'lent' || debt.settledAt) return sum;
    if (debt.source?.kind !== 'saving' || debt.source.savingId !== savingId) return sum;
    return sum + Math.max(0, debt.amount - debtPaid(payments, debt.id));
  }, 0);
