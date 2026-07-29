import {useDebtsStore} from '@/features/debts';
import {useMovementsStore} from '@/features/expenses';
import {useSavingsStore} from '@/features/savings';
import {useSubscriptionsStore} from '@/features/subscriptions';

export const useResetData = () => {
  const clearMovements = useMovementsStore((s) => s.clear);
  const clearSubscriptions = useSubscriptionsStore((s) => s.clear);
  const clearSavings = useSavingsStore((s) => s.clear);
  const clearDebts = useDebtsStore((s) => s.clear);

  return () => {
    clearMovements();
    clearSubscriptions();
    clearSavings();
    clearDebts();
  };
};
