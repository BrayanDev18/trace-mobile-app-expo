import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {sumByKey} from '@/utils';

import type {Goal, GoalContribution} from './types';

type GoalsState = {
  goals: Goal[];
  contributions: GoalContribution[];
  addGoal: (data: Omit<Goal, 'id' | 'createdAt'>) => void;
  archiveGoal: (id: string) => void;
  addContribution: (data: Omit<GoalContribution, 'id' | 'date'>) => void;
  removeContribution: (id: string) => void;
};

/**
 * Fuente temporal de metas de ahorro mientras no existe el backend. Cuando
 * llegue la API de Go, la lista pasa a TanStack Query y las escrituras a
 * mutaciones; este store desaparece. Ids y fechas se generan aquí, nunca
 * en las pantallas.
 */
export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [],
      contributions: [],
      addGoal: (data) =>
        set((state) => ({
          goals: [
            {...data, id: String(Date.now()), createdAt: new Date().toISOString()},
            ...state.goals,
          ],
        })),
      archiveGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? {...g, archivedAt: new Date().toISOString()} : g,
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
    }),
    {
      name: 'trace-goals',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({goals: state.goals, contributions: state.contributions}),
    },
  ),
);

export const goalSaved = (contributions: GoalContribution[], goalId: string) =>
  sumByKey(contributions, 'goalId', goalId);
