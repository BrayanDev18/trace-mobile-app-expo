import {goalSaved} from './store';
import type {GoalProps, GoalContributionProps} from './types';

export const monthsUntil = (deadline: string, from = new Date()) => {
  const target = new Date(deadline);
  const months =
    (target.getFullYear() - from.getFullYear()) * 12 + (target.getMonth() - from.getMonth());
  return Math.max(0, months);
};

export const goalProgress = (goal: GoalProps, contributions: GoalContributionProps[]) => {
  const saved = goalSaved(contributions, goal.id);
  const progress = goal.targetAmount > 0 ? saved / goal.targetAmount : 0;
  const percent = Math.min(100, Math.round(progress * 100));
  const remaining = Math.max(0, goal.targetAmount - saved);
  const months = goal.deadline ? monthsUntil(goal.deadline) : null;
  const monthly = months !== null && remaining > 0 ? remaining / Math.max(1, months) : null;

  return {saved, progress, percent, remaining, months, monthly};
};