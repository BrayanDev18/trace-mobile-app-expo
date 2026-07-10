import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Fuente temporal de metas de ahorro mientras no existe el backend. Cuando
 * llegue la API de Go, la lista pasa a TanStack Query y las escrituras a
 * mutaciones; este store desaparece.
 *
 * El progreso nunca se guarda como contador mutable: se deriva sumando los
 * aportes (`contributions`) de cada meta. Las metas terminadas se archivan
 * con `archivedAt` en vez de borrarse, para conservar su historial.
 */
export type Goal = {
  id: string;
  name: string;
  themeId: string;
  targetAmount: number;
  deadline?: string;
  createdAt: string;
  archivedAt?: string;
};

export type GoalContribution = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
};

type GoalsState = {
  goals: Goal[];
  contributions: GoalContribution[];
  addGoal: (goal: Goal) => void;
  archiveGoal: (id: string) => void;
  addContribution: (contribution: GoalContribution) => void;
  removeContribution: (id: string) => void;
};

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [],
      contributions: [],
      addGoal: (goal) => set((state) => ({goals: [goal, ...state.goals]})),
      archiveGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? {...g, archivedAt: new Date().toISOString()} : g,
          ),
        })),
      addContribution: (contribution) =>
        set((state) => ({contributions: [contribution, ...state.contributions]})),
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
  contributions.reduce((sum, c) => (c.goalId === goalId ? sum + c.amount : sum), 0);
