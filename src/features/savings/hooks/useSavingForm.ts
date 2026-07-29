import {useState} from 'react';
import {router} from 'expo-router';

import {haptic} from '@/utils';

import {useSavingsStore} from '../store';
import {SAVING_THEMES} from '../themes';

export const useSavingForm = () => {
  const addSaving = useSavingsStore((s) => s.addSaving);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [themeId, setThemeId] = useState(SAVING_THEMES[0].id);
  const [attempted, setAttempted] = useState(false);

  const nameValid = name.trim().length > 0;

  const submit = () => {
    if (!nameValid) {
      setAttempted(true);
      haptic.error();
      return;
    }
    const target = Number(amount);
    addSaving({
      name: name.trim(),
      themeId,
      targetAmount: target > 0 ? target : undefined,
      deadline: deadline?.toISOString(),
    });
    haptic.success();
    router.back();
  };

  return {
    name, setName,
    amount, setAmount,
    deadline, setDeadline,
    themeId, setThemeId,
    attempted, nameValid, submit,
  };
};