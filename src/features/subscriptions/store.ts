import {createPersistedListStore} from '@/store/createListStore';

import type {SubscriptionProps} from './types';

type PersistedV0Props = {items?: (Omit<SubscriptionProps, 'domain'> & {category?: string; domain?: string})[]};

export const useSubscriptionsStore = createPersistedListStore<SubscriptionProps>(
  'trace-subscriptions',
  {
    version: 1,
    migrate: (persisted) => {
      const state = persisted as PersistedV0Props;
      return {
        items: (state.items ?? []).map(({category, ...item}) => ({
          ...item,
          domain: item.domain ?? category ?? '',
        })),
      };
    },
  },
);
