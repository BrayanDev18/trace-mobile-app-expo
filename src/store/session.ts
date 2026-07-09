import { create } from 'zustand';

type SessionState = {
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  // Flags quemados hasta tener auth/persistencia reales.
  hasOnboarded: false,
  isAuthenticated: true,
  completeOnboarding: () => set({ hasOnboarded: true }),
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
