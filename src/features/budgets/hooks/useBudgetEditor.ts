import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {useAmountInput} from '@/hooks/useAmountInput';
import {confirmDestructive, haptic} from '@/utils';

import {useBudgetsStore} from '../store';

export const useBudgetEditor = () => {
  const {t} = useTranslation();
  const budgets = useBudgetsStore((s) => s.items);
  const updateBudget = useBudgetsStore((s) => s.update);
  const removeBudget = useBudgetsStore((s) => s.remove);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [raw, setRaw] = useState('');

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => raw,
    onChange: setRaw,
  });

  const editing = editingId ? (budgets.find((budget) => budget.id === editingId) ?? null) : null;

  const open = (id: string) => {
    const budget = budgets.find((item) => item.id === id);
    setRaw(budget ? String(budget.assigned) : '');
    setEditingId(id);
  };

  const close = () => {
    setEditingId(null);
    setRaw('');
  };

  const save = () => {
    if (!editingId) return;
    const assigned = Number(raw);

    if (!(assigned > 0)) {
      haptic.error();
      shakeError();
      return;
    }

    updateBudget(editingId, {assigned});
    haptic.success();
    close();
  };

  const remove = () => {
    if (!editingId) return;

    confirmDestructive({
      title: t('budgets:removeConfirmTitle'),
      message: t('budgets:removeConfirmBody'),
      actionLabel: t('budgets:remove'),
      onConfirm: () => {
        removeBudget(editingId);
        close();
      },
    });
  };

  return {editing, raw, animatedStyle, onKey, erase, clear, open, close, save, remove};
};