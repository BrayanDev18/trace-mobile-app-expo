import {useState} from 'react';
import {router} from 'expo-router';

import {useMovementsStore} from '@/features/expenses';
import {haptic, shortDate} from '@/utils';

import {useSubscriptionsStore} from '../store';
import type {BrandResult, Subscription} from '../types';

/** Validación lazy (design.md §7): errores solo tras el primer intento de envío. */
export const useSubscriptionForm = () => {
  const add = useSubscriptionsStore((s) => s.add);
  const addFirstCharge = useMovementsStore((s) => s.add);

  const [brand, setBrand] = useState<BrandResult | null>(null);
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<Subscription['period']>('monthly');
  const [date, setDate] = useState(() => new Date());
  const [methodId, setMethodId] = useState<string | undefined>(undefined);
  const [attempted, setAttempted] = useState(false);

  const amountValid = Number(price) > 0;

  const submit = (onAmountError: () => void) => {
    if (!brand) return;
    if (!amountValid) {
      setAttempted(true);
      haptic.error();
      onAmountError();
      return;
    }

    const next = new Date(date);
    if (period === 'yearly') next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);

    const subscription = add({
      name: brand.name,
      domain: brand.domain,
      logoUrl: brand.logo_url,
      price: Number(price),
      period,
      nextCharge: shortDate(next),
      methodId,
    });
    addFirstCharge({
      type: 'expense',
      reason: brand.name,
      amount: Number(price),
      date: date.toISOString(),
      categoryId: 'subscriptions',
      methodId,
      subscriptionId: subscription.id,
    });
    haptic.success();
    router.back();
  };

  return {
    brand, setBrand,
    price, setPrice,
    period, setPeriod,
    date, setDate,
    methodId, setMethodId,
    attempted, amountValid, submit,
  };
};
