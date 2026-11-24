import {useMemo} from 'react';

import {useIncomeStore} from '../store';
import {activeCycle} from '../utils';

export const useActiveCycle = () => {
  const config = useIncomeStore((s) => s.config);

  return useMemo(() => (config ? activeCycle(config, new Date()) : null), [config]);
};
