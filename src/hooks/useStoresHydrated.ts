import {useSyncExternalStore} from 'react';

import {useBudgetsStore} from '@/features/budgets';
import {useDebtsStore} from '@/features/debts';
import {useMovementsStore} from '@/features/expenses';
import {useIncomeStore} from '@/features/income';
import {useSavingsStore} from '@/features/savings';
import {useSubscriptionsStore} from '@/features/subscriptions';
import {useLocaleStore} from '@/store/locale';
import {useSessionStore} from '@/store/session';
import {useThemeStore} from '@/store/theme';

const stores = [
  useMovementsStore,
  useSubscriptionsStore,
  useDebtsStore,
  useSavingsStore,
  useBudgetsStore,
  useIncomeStore,
  useSessionStore,
  useThemeStore,
  useLocaleStore,
];

const allHydrated = () => stores.every((store) => store.persist.hasHydrated());

const subscribe = (onChange: () => void) => {
  const unsubs = stores.map((store) => store.persist.onFinishHydration(onChange));
  return () => unsubs.forEach((unsub) => unsub());
};

export const useStoresHydrated = () => useSyncExternalStore(subscribe, allHydrated);
