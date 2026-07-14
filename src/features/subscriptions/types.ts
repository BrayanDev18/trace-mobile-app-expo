import type {ComponentType} from 'react';

export type BrandIcon = ComponentType<{size?: number; color?: string}>;

/**
 * Solo datos serializables: los iconos se guardan como referencias
 * (`methodId`, `logoUrl`) y se resuelven al renderizar.
 */
export type Subscription = {
  id: string;
  name: string;
  domain: string;
  icon?: BrandIcon;
  logoUrl?: string;
  price: number;
  period: 'monthly' | 'yearly';
  nextCharge: string;
  methodId?: string;
};

export type BrandResult = {
  name: string;
  domain: string;
  logo_url: string;
};