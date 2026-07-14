/**
 * El progreso nunca se guarda como contador mutable: se deriva sumando los
 * aportes (`contributions`) de cada meta. Las metas terminadas se archivan
 * con `archivedAt` en vez de borrarse, para conservar su historial.
 */
export type Goal = {
  id: string;
  name: string;
  themeId: string;
  targetAmount: number;
  deadline?: string;
  createdAt: string;
  archivedAt?: string;
};

export type GoalContribution = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
};