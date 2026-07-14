export type MovementType = 'expense' | 'income';

/**
 * `subscriptionId` marca los movimientos generados por una suscripción:
 * el primer cobro se crea al dar de alta la suscripción; los cobros
 * recurrentes siguientes son un proceso aparte (pendiente).
 */
export type Movement = {
  id: string;
  type: MovementType;
  reason: string;
  amount: number;
  date: string;
  categoryId: string;
  methodId?: string;
  receiptUri?: string;
  subscriptionId?: string;
};
