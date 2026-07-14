export type DebtDirectionProps = 'lent' | 'owed';

export type DebtProps = {
  id: string;
  direction: DebtDirectionProps;
  person: string;
  amount: number;
  dueDate?: string;
  createdAt: string;
  settledAt?: string;
};

export type DebtPaymentProps = {
  id: string;
  debtId: string;
  amount: number;
  date: string;
};
