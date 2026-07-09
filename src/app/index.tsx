import { Redirect } from 'expo-router';

import { useSessionStore } from '@/store/session';

export default function Index() {
  const hasOnboarded = useSessionStore((s) => s.hasOnboarded);

  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  // TODO(auth): cuando exista (public)/login -> if (!isAuthenticated) return <Redirect href="/login" />;
  return <Redirect href="/home" />;
}
