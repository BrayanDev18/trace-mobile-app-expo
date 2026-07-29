import {useState} from 'react';

import i18next from '@/i18n';
import {useSessionStore} from '@/store/session';
import {haptic} from '@/utils';

import {useAccountsStore} from '../store';
import {goAfterAuth} from '../utils';

export const OTP_LENGTH = 6;

export const useOtpVerification = (email?: string) => {
  const signIn = useSessionStore((s) => s.signIn);
  const findByEmail = useAccountsStore((s) => s.findByEmail);

  const [code, setCode] = useState('');
  const complete = code.length === OTP_LENGTH;

  const onKey = (key: string) => {
    if (!/^\d$/.test(key) || complete) return;
    haptic.tap();
    setCode(code + key);
  };

  const onErase = () => {
    if (!code) return;
    haptic.tap();
    setCode(code.slice(0, -1));
  };

  const onClear = () => {
    if (!code) return;
    haptic.tap();
    setCode('');
  };

  const verify = () => {
    if (!complete) return;
    const account = findByEmail(email ?? '');
    haptic.success();
    signIn({name: account?.fullName ?? i18next.t('auth:ui.guest'), email: account?.email ?? email ?? ''});
    goAfterAuth();
  };

  return {code, complete, keypad: {onKey, onErase, onClear}, verify};
};