import { Redirect, Stack } from 'expo-router';

import { useSubscriptionCharges } from '@/features/subscriptions';
import { useStoresHydrated } from '@/hooks/useStoresHydrated';
import { useSessionStore } from '@/store/session';

export default function ProtectedLayout() {
  const hydrated = useStoresHydrated();
  const isAuthenticated = useSessionStore((s) => s.user !== null);

  useSubscriptionCharges();

  if (!hydrated) return null;
  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="expenses/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="income/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="subscriptions/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="savings/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="budgets/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="debts/new" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
