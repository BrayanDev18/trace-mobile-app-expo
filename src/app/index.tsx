import { Redirect } from 'expo-router';

import { useStoresHydrated } from '@/hooks/useStoresHydrated';
import { useSessionStore } from '@/store/session';
import { isOwner } from '@/utils';

export default function Index() {
  const hydrated = useStoresHydrated();
  const hasOnboarded = useSessionStore((s) => s.hasOnboarded);
  const hasSeenWelcome = useSessionStore((s) => s.hasSeenWelcome);
  const isAuthenticated = useSessionStore((s) => s.user !== null);
  const owner = useSessionStore((s) => isOwner(s.user?.email));

  if (!hydrated) return null;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  if (owner && !hasSeenWelcome) return <Redirect href="/welcome" />;

  return <Redirect href="/home" />;
}