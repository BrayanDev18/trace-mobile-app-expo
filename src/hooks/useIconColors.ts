import {useColorScheme} from 'react-native';

export const useIconColors = () => {
  const dark = useColorScheme() === 'dark';

  return {
    primary: dark ? '#ffffff' : '#000000',
    muted: dark ? '#a3a3a3' : '#737373',
    faint: dark ? '#525252' : '#a3a3a3',
    onAccent: dark ? '#ffffff' : '#171717',
  } as const;
};
