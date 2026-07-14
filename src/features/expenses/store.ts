import {createPersistedListStore} from '@/store/createListStore';

import type {Movement} from './types';

/**
 * Fuente temporal de movimientos (gastos e ingresos) mientras no existe el
 * backend. Cuando llegue la API de Go, la lista pasa a TanStack Query y
 * crear/eliminar a mutaciones; este store desaparece.
 */
export const useMovementsStore = createPersistedListStore<Movement>('trace-movements');
