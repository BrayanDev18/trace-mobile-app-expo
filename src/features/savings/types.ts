export type SavingProps = {
  id: string;
  name: string;
  themeId: string;
  targetAmount?: number;
  deadline?: string;
  createdAt: string;
  archivedAt?: string;
};

export type SavingContributionProps = {
  id: string;
  savingId: string;
  amount: number;
  date: string;
  note?: string;
};
