import {dateNames} from '@/utils';

import type {SubscriptionProps} from './types';

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T/;
const DAY_PATTERN = /\d+/;
const MONTH_PATTERN = /[a-záéíóúñ]+/i;

const clampDay = (year: number, month: number, day: number) =>
  new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));

const monthIndex = (token: string) => {
  const needle = token.toLowerCase();

  for (const language of ['es', 'en'] as const) {
    const index = dateNames(language).monthsShort.findIndex(
      (month) => month.toLowerCase() === needle,
    );
    if (index >= 0) return index;
  }

  return -1;
};

export const advanceCharge = (from: Date, period: SubscriptionProps['period']) =>
  period === 'yearly'
    ? clampDay(from.getFullYear() + 1, from.getMonth(), from.getDate())
    : clampDay(from.getFullYear(), from.getMonth() + 1, from.getDate());

export const parseCharge = (value: string, now: Date) => {
  if (ISO_PATTERN.test(value)) return new Date(value);

  const day = Number(value.match(DAY_PATTERN)?.[0]);
  const month = monthIndex(value.match(MONTH_PATTERN)?.[0] ?? '');
  if (!day || month < 0) return now;

  return [-1, 0, 1]
    .map((offset) => clampDay(now.getFullYear() + offset, month, day))
    .reduce((closest, candidate) =>
      Math.abs(candidate.getTime() - now.getTime()) < Math.abs(closest.getTime() - now.getTime())
        ? candidate
        : closest,
    );
};
