import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalePreferenceProps = 'system' | 'es' | 'en';

type LocaleStateProps = {
  preference: LocalePreferenceProps;
  setPreference: (preference: LocalePreferenceProps) => void;
};

export const useLocaleStore = create<LocaleStateProps>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({preference}),
    }),
    {
      name: 'trace-locale',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
