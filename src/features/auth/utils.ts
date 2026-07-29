import {router} from 'expo-router';

import {ScreenRoutes} from '@/constants';
import {useSessionStore} from '@/store/session';
import {isOwner} from '@/utils';

export const goAfterAuth = () => {
  const {hasSeenWelcome, hasSeenIncomePrompt, user} = useSessionStore.getState();

  if (!hasSeenIncomePrompt) {
    router.replace(ScreenRoutes.incomeSetup);
    return;
  }

  const showWelcome = isOwner(user?.email) && !hasSeenWelcome;
  router.replace(showWelcome ? ScreenRoutes.welcome : ScreenRoutes.home);
};
