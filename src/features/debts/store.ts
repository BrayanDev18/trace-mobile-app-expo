import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {sumByKey} from '@/utils';

import type {Debt, DebtPayment} from './types';

type DebtsState = {
  debts: Debt[];
  payments: DebtPayment[];
  addDebt: (data: Omit<Debt, 'id' | 'createdAt'>) => void;
  settleDebt: (id: string) => void;
  addPayment: (data: Omit<DebtPayment, 'id' | 'date'>) => void;
  removePayment: (id: string) => void;
};

/**
 * Fuente temporal de deudas mientras no existe el backend. Cuando llegue la
 * API de Go, la lista pasa a TanStack Query y las escrituras a mutaciones;
 * este store desaparece. Ids y fechas se generan aquí, nunca en las pantallas.
 */
export const useDebtsStore = create<DebtsState>()(
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
    }),
    {
      name: 'trace-debts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({debts: state.debts, payments: state.payments}),
    },
  ),
);

export const debtPaid = (payments: DebtPayment[], debtId: string) =>
  sumByKey(payments, 'debtId', debtId);
