import {useState} from 'react';
import {router} from 'expo-router';

import {useMovementsStore} from '@/features/expenses';
import {haptic} from '@/utils';

import {useSubscriptionsStore} from '../store';
import type {BrandResultProps, SubscriptionProps} from '../types';
import {advanceCharge} from '../utils';

export const useSubscriptionForm = () => {
  const add = useSubscriptionsStore((s) => s.add);
  const addFirstCharge = useMovementsStore((s) => s.add);

  const [brand, setBrand] = useState<BrandResultProps | null>(null);
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<SubscriptionProps['period']>('monthly');
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

    const subscription = add({
      name: brand.name,
      domain: brand.domain,
      logoUrl: brand.logo_url,
      price: Number(price),
      period,
      nextCharge: advanceCharge(date, period).toISOString(),
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
      platform: {name: brand.name, logo: brand.logo_url, domain: brand.domain},
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
