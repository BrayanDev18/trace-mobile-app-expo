import {createPersistedListStore} from '@/store/createListStore';

import type {SubscriptionProps} from './types';
import {parseCharge} from './utils';

type PersistedProps = {
  items?: (Omit<SubscriptionProps, 'domain'> & {category?: string; domain?: string})[];
};

export const useSubscriptionsStore = createPersistedListStore<SubscriptionProps>(
  'trace-subscriptions',
  {
    version: 2,
    migrate: (persisted) => {
      const state = persisted as PersistedProps;
      const now = new Date();

      return {
        items: (state.items ?? []).map(({category, ...item}) => ({
          ...item,
          domain: item.domain ?? category ?? '',
          nextCharge: parseCharge(item.nextCharge, now).toISOString(),
        })),
      };
    },
  },
);
