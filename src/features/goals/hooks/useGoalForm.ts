import {useState} from 'react';
import {router} from 'expo-router';

import {haptic} from '@/utils';

import {useGoalsStore} from '../store';
import {GOAL_THEMES} from '../themes';

/** Validación lazy (design.md §7): errores solo tras el primer intento de envío. */
export const useGoalForm = () => {
  const addGoal = useGoalsStore((s) => s.addGoal);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [themeId, setThemeId] = useState(GOAL_THEMES[0].id);
  const [attempted, setAttempted] = useState(false);

  const amountValid = Number(amount) > 0;
  const nameValid = name.trim().length > 0;

  const submit = (onAmountError: () => void) => {
    if (!nameValid || !amountValid) {
      setAttempted(true);
      haptic.error();
      if (!amountValid) onAmountError();
      return;
    }
    addGoal({
      name: name.trim(),
      themeId,
      targetAmount: Number(amount),
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
    attempted, amountValid, nameValid, submit,
  };
};
