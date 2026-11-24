import {useEffect} from 'react';

import {useMovementsStore} from '@/features/expenses';

import {useSubscriptionsStore} from '../store';
import {advanceCharge, parseCharge} from '../utils';

const MAX_CATCH_UP = 24;
const BACKFILL_MS = 62 * 86_400_000;

export const useSubscriptionCharges = () => {
  const subscriptions = useSubscriptionsStore((s) => s.items);
  const update = useSubscriptionsStore((s) => s.update);
  const movements = useMovementsStore((s) => s.items);
  const addMovement = useMovementsStore((s) => s.add);

  useEffect(() => {
    const now = new Date();

    for (const subscription of subscriptions) {
      let charge = parseCharge(subscription.nextCharge, now);
      if (charge.getTime() > now.getTime()) continue;

      for (let step = 0; step < MAX_CATCH_UP && charge.getTime() <= now.getTime(); step++) {
        const date = charge.toISOString();
        const stale = now.getTime() - charge.getTime() > BACKFILL_MS;
        const registered = movements.some(
          (movement) => movement.subscriptionId === subscription.id && movement.date === date,
        );

        if (!stale && !registered) {
          addMovement({
            type: 'expense',
            reason: subscription.name,
            amount: subscription.price,
            date,
            categoryId: 'subscriptions',
            methodId: subscription.methodId,
            subscriptionId: subscription.id,
            platform: subscription.logoUrl
              ? {name: subscription.name, logo: subscription.logoUrl, domain: subscription.domain}
              : undefined,
          });
        }

        charge = advanceCharge(charge, subscription.period);
      }

      update(subscription.id, {nextCharge: charge.toISOString()});
    }
  }, [subscriptions, movements, addMovement, update]);
};
