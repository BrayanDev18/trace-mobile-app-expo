import {useEffect, useState} from 'react';

import {haptic} from '@/utils';

const RESEND_SECONDS = 30;

export const useResendCountdown = () => {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const resend = () => {
    haptic.tap();
    setSeconds(RESEND_SECONDS);
  };

  return {seconds, canResend: seconds === 0, resend};
};