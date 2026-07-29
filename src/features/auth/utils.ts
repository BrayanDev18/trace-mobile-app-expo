import {router} from 'expo-router';

import {ScreenRoutes} from '@/constants';
import {useSessionStore} from '@/store/session';
import {isOwner} from '@/utils';

export const goAfterAuth = () => {
  const {hasSeenWelcome, user} = useSessionStore.getState();
  const showWelcome = isOwner(user?.email) && !hasSeenWelcome;

  router.replace(showWelcome ? ScreenRoutes.welcome : ScreenRoutes.home);
};
