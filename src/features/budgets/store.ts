import {createPersistedListStore} from '@/store/createListStore';

import type {BudgetProps} from './types';

export const useBudgetsStore = createPersistedListStore<BudgetProps>('trace-budgets', {
  version: 2,
  migrate: (state, version) => (version < 2 ? {items: []} : (state as {items: BudgetProps[]})),
});