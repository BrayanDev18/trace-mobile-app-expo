import {useEffect} from 'react';
import {DarkTheme, DefaultTheme, Stack, ThemeProvider} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {Appearance} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {colorScheme as cssColorScheme} from 'react-native-css';
import {useLocales} from 'expo-localization';

import i18n from '@/i18n';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useLocaleStore} from '@/store/locale';
import {useThemeStore} from '@/store/theme';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const preference = useThemeStore((s) => s.preference);
  const scheme = useColorScheme();

  const localePreference = useLocaleStore((s) => s.preference);
  const locales = useLocales();
  const deviceLanguage = locales[0]?.languageCode === 'en' ? 'en' : 'es';
  const language = localePreference === 'system' ? deviceLanguage : localePreference;

  useEffect(() => {
    cssColorScheme.set(scheme);
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [scheme, preference]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{headerShown: false}}/>
              <StatusBar style={scheme === 'dark' ? 'light' : 'dark'}/>
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
