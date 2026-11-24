import {useMemo} from 'react';

import {useMovementsStore} from '@/features/expenses';
import {haptic} from '@/utils';

import {useIncomeStore} from '../store';
import {detectCycle} from '../utils';

export const useCycleProposal = () => {
  const config = useIncomeStore((s) => s.config);
  const dismissedAt = useIncomeStore((s) => s.proposalDismissedAt);
  const setConfig = useIncomeStore((s) => s.setConfig);
  const dismissProposal = useIncomeStore((s) => s.dismissProposal);
  const movements = useMovementsStore((s) => s.items);

  const detected = useMemo(
    () => (config || dismissedAt ? null : detectCycle(movements)),
    [config, dismissedAt, movements],
  );

  const accept = () => {
    if (!detected) return;
    haptic.success();
    setConfig(detected);
  };

  const dismiss = () => {
    haptic.tap();
    dismissProposal();
  };

  return {detected, accept, dismiss};
};
