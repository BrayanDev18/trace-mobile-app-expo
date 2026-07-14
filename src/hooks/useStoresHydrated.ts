import {useSyncExternalStore} from 'react';

import {useDebtsStore} from '@/features/debts';
import {useGoalsStore} from '@/features/goals';
import {useMovementsStore} from '@/features/expenses';
import {useSubscriptionsStore} from '@/features/subscriptions';

const stores = [useMovementsStore, useSubscriptionsStore, useDebtsStore, useGoalsStore];

const allHydrated = () => stores.every((store) => store.persist.hasHydrated());

const subscribe = (onChange: () => void) => {
  const unsubs = stores.map((store) => store.persist.onFinishHydration(onChange));
  return () => unsubs.forEach((unsub) => unsub());
};

export const useStoresHydrated = () => useSyncExternalStore(subscribe, allHydrated);
