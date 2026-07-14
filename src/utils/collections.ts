export const sumByKey = <T extends {amount: number}>(items: T[], key: keyof T, id: string) =>
  items.reduce((sum, item) => ((item[key] as string) === id ? sum + item.amount : sum), 0);