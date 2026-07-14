export type GoalProps = {
  id: string;
  name: string;
  themeId: string;
  targetAmount: number;
  deadline?: string;
  createdAt: string;
  archivedAt?: string;
};

export type GoalContributionProps = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
};