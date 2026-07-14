/**
 * `direction` distingue quién debe: 'lent' = me deben, 'owed' = yo debo.
 * El saldo pendiente nunca se guarda: se deriva restando los abonos
 * (`payments`) del monto original. Las deudas pagadas se saldan con
 * `settledAt` en vez de borrarse, para conservar su historial.
 */
export type DebtDirection = 'lent' | 'owed';

export type Debt = {
  id: string;
  direction: DebtDirection;
  person: string;
  amount: number;
  dueDate?: string;
  createdAt: string;
  settledAt?: string;
};

export type DebtPayment = {
  id: string;
  debtId: string;
  amount: number;
  date: string;
};
