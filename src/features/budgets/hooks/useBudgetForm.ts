import {useState} from 'react';
import {router} from 'expo-router';

import {haptic} from '@/utils';

import {useBudgetsStore} from '../store';
import {BUDGET_THEMES} from '../themes';

export const useBudgetForm = () => {
  const addBudget = useBudgetsStore((s) => s.add);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [themeId, setThemeId] = useState(BUDGET_THEMES[0].id);
  const [attempted, setAttempted] = useState(false);

  const nameValid = name.trim().length > 0;
  const amountValid = Number(amount) > 0;

  const submit = (onAmountError?: () => void) => {
    if (!nameValid || !amountValid) {
      setAttempted(true);
      haptic.error();
      if (!amountValid) onAmountError?.();
      return;
    }

    addBudget({
      name: name.trim(),
      themeId,
      assigned: Number(amount),
      createdAt: new Date().toISOString(),
    });
    haptic.success();
    router.back();
  };

  return {
    name, setName,
    amount, setAmount,
    themeId, setThemeId,
    attempted, nameValid, amountValid, submit,
  };
};
