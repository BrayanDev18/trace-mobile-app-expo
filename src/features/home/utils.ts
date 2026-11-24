import type {MovementProps} from '@/features/expenses';
import {inCycle, type CycleRangeProps} from '@/features/income';

export const movementsInCycle = (movements: MovementProps[], cycle: CycleRangeProps | null) =>
  cycle ? movements.filter((movement) => inCycle(movement.date, cycle)) : movements;
