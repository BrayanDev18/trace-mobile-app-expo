export type MovementTypeProps = 'expense' | 'income';

export type PlatformProps = {
  name: string;
  logo: string;
  domain: string;
};

export type MovementProps = {
  id: string;
  type: MovementTypeProps;
  reason: string;
  amount: number;
  date: string;
  categoryId: string;
  methodId?: string;
  budgetId?: string;
  receiptUris?: string[];
  subscriptionId?: string;
  platform?: PlatformProps;
};