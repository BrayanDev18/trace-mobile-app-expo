import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Fuente temporal de deudas mientras no existe el backend. Cuando llegue la
 * API de Go, la lista pasa a TanStack Query y las escrituras a mutaciones;
 * este store desaparece.
 *
 * `direction` distingue quién debe: 'lent' = me deben, 'owed' = yo debo.
 * El saldo pendiente nunca se guarda: se deriva restando los abonos
 * (`payments`) del monto original. Las deudas pagadas se saldan con
 * `settledAt` en vez de borrarse, para conservar su historial.
 */
export type DebtDirection = 'lent' | 'owed';

export type Debt = {
  id: string;
  direction: DebtDirection;
  person: string;
  amount: number;
  dueDate?: string;
  createdAt: string;
  settledAt?: string;
};

export type DebtPayment = {
  id: string;
  debtId: string;
  amount: number;
  date: string;
};

type DebtsState = {
  debts: Debt[];
  payments: DebtPayment[];
  addDebt: (debt: Debt) => void;
  settleDebt: (id: string) => void;
  addPayment: (payment: DebtPayment) => void;
  removePayment: (id: string) => void;
};

export const useDebtsStore = create<DebtsState>()(
  persist(
    (set) => ({
      debts: [],
      payments: [],
      addDebt: (debt) => set((state) => ({debts: [debt, ...state.debts]})),
      settleDebt: (id) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? {...d, settledAt: new Date().toISOString()} : d,
          ),
        })),
      addPayment: (payment) => set((state) => ({payments: [payment, ...state.payments]})),
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
  payments.reduce((sum, p) => (p.debtId === debtId ? sum + p.amount : sum), 0);
