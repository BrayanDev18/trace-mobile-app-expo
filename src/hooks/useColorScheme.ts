import {useColorScheme as useSystemColorScheme} from 'react-native';

import {useThemeStore} from '@/store/theme';

export const useColorScheme = (): 'light' | 'dark' => {
  const preference = useThemeStore((s) => s.preference);
  const system = useSystemColorScheme();

  if (preference === 'light' || preference === 'dark') return preference;
  return system === 'dark' ? 'dark' : 'light';
};
