import {createPersistedListStore} from '@/store/createListStore';

import type {Subscription} from './types';

type PersistedV0 = {items?: (Omit<Subscription, 'domain'> & {category?: string; domain?: string})[]};

/**
 * Fuente temporal de suscripciones mientras no existe el backend.
 * Cuando llegue la API de Go, la lista pasa a TanStack Query (useQuery)
 * y agregar/eliminar a mutaciones; este store desaparece.
 */
export const useSubscriptionsStore = createPersistedListStore<Subscription>(
  'trace-subscriptions',
  {
    version: 1,
    migrate: (persisted) => {
      const state = persisted as PersistedV0;
      return {
        items: (state.items ?? []).map(({category, ...item}) => ({
          ...item,
          domain: item.domain ?? category ?? '',
        })),
      };
    },
  },
);
