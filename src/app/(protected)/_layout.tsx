import { Stack } from 'expo-router';

import { useStoresHydrated } from '@/hooks/useStoresHydrated';

export default function ProtectedLayout() {
  const hydrated = useStoresHydrated();

  if (!hydrated) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="expenses/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="subscriptions/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="goals/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="debts/new" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
