import {useState} from 'react';
import {router} from 'expo-router';

import {ScreenRoutes} from '@/constants';
import {useAmountInput} from '@/hooks/useAmountInput';
import {useSessionStore} from '@/store/session';
import {haptic, isOwner} from '@/utils';

import {useIncomeStore} from '../store';
import type {PayFrequencyProps} from '../types';

const DEFAULT_PAYDAYS: Record<PayFrequencyProps, number> = {
  weekly: 5,
  biweekly: 15,
  monthly: 30,
};

export const useIncomeForm = () => {
  const existing = useIncomeStore((s) => s.config);
  const setConfig = useIncomeStore((s) => s.setConfig);
  const completeIncomePrompt = useSessionStore((s) => s.completeIncomePrompt);

  const [isEditing] = useState(() => router.canGoBack());
  const [amount, setAmount] = useState(existing?.amount ? String(existing.amount) : '');
  const [frequency, setFrequencyState] = useState<PayFrequencyProps>(
    existing?.frequency ?? 'monthly',
  );
  const [payday, setPayday] = useState(existing?.payday ?? DEFAULT_PAYDAYS.monthly);

  const {animatedStyle, onText} = useAmountInput({
    getValue: () => amount,
    onChange: setAmount,
  });

  const setFrequency = (next: PayFrequencyProps) => {
    setFrequencyState(next);
    setPayday(existing?.frequency === next ? existing.payday : DEFAULT_PAYDAYS[next]);
  };

  const leave = () => {
    completeIncomePrompt();

    if (isEditing) {
      router.back();
      return;
    }

    const {hasSeenWelcome, user} = useSessionStore.getState();
    const showWelcome = isOwner(user?.email) && !hasSeenWelcome;
    router.replace(showWelcome ? ScreenRoutes.welcome : ScreenRoutes.home);
  };

  const save = () => {
    const value = Number(amount);
    setConfig({amount: value > 0 ? value : null, frequency, payday});
    haptic.success();
    leave();
  };

  const skip = () => {
    haptic.tap();
    leave();
  };

  return {
    isEditing,
    amount,
    onAmountText: onText,
    animatedStyle,
    frequency,
    setFrequency,
    payday,
    setPayday,
    save,
    skip,
  };
};
