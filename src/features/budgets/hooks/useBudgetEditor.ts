import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {useAmountInput} from '@/hooks/useAmountInput';
import {confirmDestructive, haptic} from '@/utils';

import {useBudgetsStore} from '../store';

export const useBudgetEditor = () => {
  const {t} = useTranslation();
  const budgets = useBudgetsStore((s) => s.items);
  const upsert = useBudgetsStore((s) => s.upsert);
  const removeBudget = useBudgetsStore((s) => s.remove);

  const [target, setTarget] = useState<'pick' | string | null>(null);
  const [raw, setRaw] = useState('');

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => raw,
    onChange: setRaw,
  });

  const editingId = target !== null && target !== 'pick' ? target : null;
  const isExisting = editingId !== null && budgets.some((b) => b.categoryId === editingId);

  const openPick = () => {
    haptic.select();
    setTarget('pick');
  };

  const openEdit = (categoryId: string) => {
    const existing = budgets.find((b) => b.categoryId === categoryId);
    setRaw(existing ? String(existing.cap) : '');
    setTarget(categoryId);
  };

  const close = () => {
    setTarget(null);
    setRaw('');
  };

  const save = () => {
    if (!editingId) return;
    const cap = Number(raw);

    if (!(cap > 0)) {
      haptic.error();
      shakeError();
      return;
    }

    upsert(editingId, cap);
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

  return {
    target,
    editingId,
    isExisting,
    raw,
    animatedStyle,
    onKey,
    erase,
    clear,
    openPick,
    openEdit,
    close,
    save,
    remove,
  };
};
