import {twMerge} from 'tailwind-merge';

export const cn = (...classes: (string | undefined | null | false)[]): string =>
  twMerge(classes.filter(Boolean).join(' '));