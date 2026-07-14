import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {sumByKey} from '@/utils';

import type {GoalProps, GoalContributionProps} from './types';

type GoalsStateProps = {
  goals: GoalProps[];
  contributions: GoalContributionProps[];
  addGoal: (data: Omit<GoalProps, 'id' | 'createdAt'>) => void;
  archiveGoal: (id: string) => void;
  addContribution: (data: Omit<GoalContributionProps, 'id' | 'date'>) => void;
  removeContribution: (id: string) => void;
};

export const useGoalsStore = create<GoalsStateProps>()(
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

export const goalSaved = (contributions: GoalContributionProps[], goalId: string) =>
  sumByKey(contributions, 'goalId', goalId);
