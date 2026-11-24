import {getCategory} from '@/constants';

import type {MovementProps, MovementTypeProps} from './types';

const SUGGESTION_WINDOW = 20;

export const suggestedCategory = (
  movements: MovementProps[],
  type: MovementTypeProps,
): string => {
  const recent = movements
    .filter((movement) => movement.type === type && !movement.subscriptionId)
    .slice(0, SUGGESTION_WINDOW);

  const counts = new Map<string, number>();
  let suggestion = '';
  let best = 0;

  for (const movement of recent) {
    const category = getCategory(movement.categoryId);
    if (category.system || category.id !== movement.categoryId) continue;

    const count = (counts.get(category.id) ?? 0) + 1;
    counts.set(category.id, count);

    if (count > best) {
      suggestion = category.id;
      best = count;
    }
  }

  return suggestion;
};
