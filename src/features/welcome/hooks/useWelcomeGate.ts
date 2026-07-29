import {useState} from 'react';
import {router} from 'expo-router';

import {ScreenRoutes} from '@/constants';
import {useSessionStore} from '@/store/session';
import {haptic} from '@/utils';

import {matchesSecret, SECRET_LENGTH} from '../utils';

export const useWelcomeGate = () => {
  const completeWelcome = useSessionStore((s) => s.completeWelcome);
  const name = useSessionStore((s) => s.user?.name.split(' ')[0]);

  const [value, setValue] = useState('');
  const [failures, setFailures] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const onChangeText = (text: string) => setValue(text.slice(0, SECRET_LENGTH));

  const onSubmit = () => {
    if (matchesSecret(value)) {
      haptic.success();
      setUnlocked(true);
      return;
    }

    haptic.error();
    setFailures((count) => count + 1);
    setValue('');
  };

  const enter = () => {
    completeWelcome();
    router.replace(ScreenRoutes.home);
  };

  const onSkip = () => {
    haptic.tap();
    router.replace(ScreenRoutes.home);
  };

  return {name, unlocked, enter, slots: {value, failures, onChangeText, onSubmit, onSkip}};
};
