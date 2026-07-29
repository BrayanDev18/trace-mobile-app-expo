import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreferenceProps = 'system' | 'light' | 'dark';

type ThemeStateProps = {
  preference: ThemePreferenceProps;
  setPreference: (preference: ThemePreferenceProps) => void;
};

export const useThemeStore = create<ThemeStateProps>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({preference}),
    }),
    {
      name: 'trace-theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
