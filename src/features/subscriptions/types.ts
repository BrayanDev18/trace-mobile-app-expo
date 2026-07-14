import type {ComponentType} from 'react';

export type BrandIconProps = ComponentType<{size?: number; color?: string}>;

export type SubscriptionProps = {
  id: string;
  name: string;
  domain: string;
  icon?: BrandIconProps;
  logoUrl?: string;
  price: number;
  period: 'monthly' | 'yearly';
  nextCharge: string;
  methodId?: string;
};

export type BrandResultProps = {
  name: string;
  domain: string;
  logo_url: string;
};