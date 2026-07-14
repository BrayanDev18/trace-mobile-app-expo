import { create } from 'zustand';

type SessionStateProps = {
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionStateProps>((set) => ({
  hasOnboarded: false,
  isAuthenticated: true,
  completeOnboarding: () => set({ hasOnboarded: true }),
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
