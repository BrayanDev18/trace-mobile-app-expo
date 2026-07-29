import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SessionUserProps = {
  name: string;
  email: string;
};

type SessionStateProps = {
  hasOnboarded: boolean;
  hasSeenWelcome: boolean;
  hasSeenIncomePrompt: boolean;
  user: SessionUserProps | null;
  completeOnboarding: () => void;
  completeWelcome: () => void;
  completeIncomePrompt: () => void;
  signIn: (user: SessionUserProps) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionStateProps>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      hasSeenWelcome: false,
      hasSeenIncomePrompt: false,
      user: null,
      completeOnboarding: () => set({hasOnboarded: true}),
      completeWelcome: () => set({hasSeenWelcome: true}),
      completeIncomePrompt: () => set({hasSeenIncomePrompt: true}),
      signIn: (user) => set({user}),
      signOut: () => set({user: null}),
    }),
    {
      name: 'trace-session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        hasSeenWelcome: state.hasSeenWelcome,
        hasSeenIncomePrompt: state.hasSeenIncomePrompt,
        user: state.user,
      }),
    },
  ),
);