import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {sumByKey} from '@/utils';

import type {SavingProps, SavingContributionProps} from './types';

type SavingsStateProps = {
  savings: SavingProps[];
  contributions: SavingContributionProps[];
  addSaving: (data: Omit<SavingProps, 'id' | 'createdAt'>) => void;
  archiveSaving: (id: string) => void;
  addContribution: (data: Omit<SavingContributionProps, 'id' | 'date'>) => void;
  removeContribution: (id: string) => void;
  clear: () => void;
};

export const useSavingsStore = create<SavingsStateProps>()(
  persist(
    (set) => ({
      savings: [],
      contributions: [],
      addSaving: (data) =>
        set((state) => ({
          savings: [
            {...data, id: String(Date.now()), createdAt: new Date().toISOString()},
            ...state.savings,
          ],
        })),
      archiveSaving: (id) =>
        set((state) => ({
          savings: state.savings.map((s) =>
            s.id === id ? {...s, archivedAt: new Date().toISOString()} : s,
          ),
        })),
      addContribution: (data) =>
        set((state) => ({
          contributions: [
            {...data, id: String(Date.now()), date: new Date().toISOString()},
            ...state.contributions,
          ],
        })),
      removeContribution: (id) =>
        set((state) => ({contributions: state.contributions.filter((c) => c.id !== id)})),
      clear: () => set({savings: [], contributions: []}),
    }),
    {
      name: 'trace-savings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({savings: state.savings, contributions: state.contributions}),
    },
  ),
);

export const savingSaved = (contributions: SavingContributionProps[], savingId: string) =>
  sumByKey(contributions, 'savingId', savingId);