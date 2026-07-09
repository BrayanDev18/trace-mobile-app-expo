import {
  IconBrandAmazon,
  IconBrandFigma,
  IconBrandNetflix,
  IconBrandSpotify,
  IconBrandYoutube,
} from '@tabler/icons-react-native';

import type {Subscription} from './SubscriptionCard';

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'YouTube Premium',
    category: 'Video',
    icon: IconBrandYoutube,
    price: 7.99,
    period: 'monthly',
    nextCharge: '22 jul',
    methodId: 'transfer',
  },
  {
    id: '2',
    name: 'Amazon Prime',
    category: 'Compras',
    icon: IconBrandAmazon,
    price: 69,
    period: 'yearly',
    nextCharge: '24 jul',
    methodId: 'visa',
  },
  {
    id: '3',
    name: 'Netflix',
    category: 'Entretenimiento',
    icon: IconBrandNetflix,
    price: 24.99,
    period: 'monthly',
    nextCharge: '27 jul',
    methodId: 'mastercard',
  },
  {
    id: '4',
    name: 'Spotify',
    category: 'Música',
    icon: IconBrandSpotify,
    price: 11.99,
    period: 'monthly',
    nextCharge: '17 ago',
    methodId: 'visa',
  },
  {
    id: '5',
    name: 'Figma',
    category: 'Diseño',
    icon: IconBrandFigma,
    price: 14.99,
    period: 'monthly',
    nextCharge: '17 ago',
    methodId: 'cash',
  },
];

export const getSubscription = (id: string): Subscription =>
  MOCK_SUBSCRIPTIONS.find((s) => s.id === id) ?? MOCK_SUBSCRIPTIONS[0];
