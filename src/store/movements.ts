import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {type MovementType} from '@/screens/expenses';

/**
 * Fuente temporal de movimientos (gastos e ingresos) mientras no existe el
 * backend. Cuando llegue la API de Go, la lista pasa a TanStack Query y
 * crear/eliminar a mutaciones; este store desaparece.
 *
 * `subscriptionId` marca los movimientos materializados desde una
 * suscripción cuando llega su fecha de cobro.
 */
export type Movement = {
  id: string;
  type: MovementType;
  reason: string;
  amount: number;
  date: string;
  categoryId: string;
  methodId?: string;
  receiptUri?: string;
  subscriptionId?: string;
};

type MovementsState = {
  items: Movement[];
  add: (movement: Movement) => void;
  remove: (id: string) => void;
};

export const useMovementsStore = create<MovementsState>()(
  persist(
    (set) => ({
      items: [],
      add: (movement) => set((state) => ({items: [movement, ...state.items]})),
      remove: (id) => set((state) => ({items: state.items.filter((m) => m.id !== id)})),
    }),
    {
      name: 'trace-movements',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({items: state.items}),
    },
  ),
);
