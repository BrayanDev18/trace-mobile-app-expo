import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {IncomeConfigProps} from './types';

type IncomeStateProps = {
  config: IncomeConfigProps | null;
  summarySeenAt: string | null;
  setConfig: (config: IncomeConfigProps) => void;
  markSummarySeen: () => void;
  clear: () => void;
};

export const useIncomeStore = create<IncomeStateProps>()(
  persist(
    (set) => ({
      config: null,
      summarySeenAt: null,
      setConfig: (config) =>
        set((state) => ({config, summarySeenAt: state.summarySeenAt ?? new Date().toISOString()})),
      markSummarySeen: () => set({summarySeenAt: new Date().toISOString()}),
      clear: () => set({config: null, summarySeenAt: null}),
    }),
    {
      name: 'trace-income',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({config: state.config, summarySeenAt: state.summarySeenAt}),
      version: 1,
    },
  ),
);
