import type {SavingProps} from './types';

export const monthsUntil = (deadline: string, from = new Date()) => {
  const target = new Date(deadline);
  const months =
    (target.getFullYear() - from.getFullYear()) * 12 + (target.getMonth() - from.getMonth());
  return Math.max(0, months);
};

export const savingProgress = (saving: SavingProps, saved: number) => {
  const target = saving.targetAmount ?? 0;
  const progress = target > 0 ? saved / target : 0;
  const percent = Math.min(100, Math.round(progress * 100));
  const remaining = Math.max(0, target - saved);
  const months = saving.deadline ? monthsUntil(saving.deadline) : null;
  const monthly = months !== null && remaining > 0 ? remaining / Math.max(1, months) : null;

  return {progress, percent, remaining, months, monthly};
};