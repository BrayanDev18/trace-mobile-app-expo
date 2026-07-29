import i18next from '@/i18n';
import {useSessionStore} from '@/store/session';
import {haptic} from '@/utils';

import {goAfterAuth} from '../utils';

export const useSocialAuth = () => {
  const signIn = useSessionStore((s) => s.signIn);

  return () => {
    haptic.success();
    signIn({name: i18next.t('auth:ui.guest'), email: ''});
    goAfterAuth();
  };
};
