import {DarkTheme, DefaultTheme, Stack, ThemeProvider} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import '../global.css';
import {useEffect} from "react";
import {useFonts} from "expo-font";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    'Satoshi-Light': require('@assets/font/Satoshi-Light.otf'),
    'Satoshi-Regular': require('@assets/font/Satoshi-Regular.otf'),
    'Satoshi-Medium': require('@assets/font/Satoshi-Medium.otf'),
    'Satoshi-Bold': require('@assets/font/Satoshi-Bold.otf'),
    'Satoshi-Black': require('@assets/font/Satoshi-Black.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [fontsLoaded, error]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{headerShown: false}}/>
              <StatusBar style="auto"/>
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
