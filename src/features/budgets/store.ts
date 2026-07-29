import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {BudgetProps} from './types';

type BudgetsStateProps = {
  items: BudgetProps[];
  upsert: (categoryId: string, cap: number) => void;
  remove: (categoryId: string) => void;
  clear: () => void;
};

export const useBudgetsStore = create<BudgetsStateProps>()(
  persist(
    (set) => ({
      items: [],
      upsert: (categoryId, cap) =>
        set((state) => ({
          items: state.items.some((item) => item.categoryId === categoryId)
            ? state.items.map((item) => (item.categoryId === categoryId ? {...item, cap} : item))
            : [...state.items, {categoryId, cap}],
        })),
      remove: (categoryId) =>
        set((state) => ({items: state.items.filter((item) => item.categoryId !== categoryId)})),
      clear: () => set({items: []}),
    }),
    {
      name: 'trace-budgets',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({items: state.items}),
      version: 1,
    },
  ),
);
