export type DebtDirectionProps = 'lent' | 'owed';

export type DebtSourceProps = {
  kind: 'income' | 'total' | 'saving';
  savingId?: string;
};

export type DebtProps = {
  id: string;
  direction: DebtDirectionProps;
  person: string;
  amount: number;
  dueDate?: string;
  source?: DebtSourceProps;
  createdAt: string;
  settledAt?: string;
};

export type DebtPaymentProps = {
  id: string;
  debtId: string;
  amount: number;
  date: string;
};
