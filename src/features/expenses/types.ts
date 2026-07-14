export type MovementTypeProps = 'expense' | 'income';

export type MovementProps = {
  id: string;
  type: MovementTypeProps;
  reason: string;
  amount: number;
  date: string;
  categoryId: string;
  methodId?: string;
  receiptUri?: string;
  subscriptionId?: string;
};
