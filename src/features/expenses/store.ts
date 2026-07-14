import {createPersistedListStore} from '@/store/createListStore';

import type {MovementProps} from './types';

export const useMovementsStore = createPersistedListStore<MovementProps>('trace-movements');
