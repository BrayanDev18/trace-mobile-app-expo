export const monthsUntil = (deadline: string, from = new Date()) => {
  const target = new Date(deadline);
  const months =
    (target.getFullYear() - from.getFullYear()) * 12 + (target.getMonth() - from.getMonth());
  return Math.max(0, months);
};
