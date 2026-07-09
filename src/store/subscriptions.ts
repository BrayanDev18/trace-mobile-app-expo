import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {type Subscription} from '@/screens/subscriptions';

/**
 * Fuente temporal de suscripciones mientras no existe el backend.
 * Cuando llegue la API de Go, la lista pasa a TanStack Query (useQuery)
 * y agregar/eliminar a mutaciones; este store desaparece.
 *
 * Solo se persisten datos serializables: los iconos se guardan como
 * referencias (`methodId`, `logoUrl`) y se resuelven al renderizar.
 */
type SubscriptionsState = {
  items: Subscription[];
  add: (subscription: Subscription) => void;
  remove: (id: string) => void;
};

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set) => ({
      items: [],
      add: (subscription) => set((state) => ({items: [subscription, ...state.items]})),
      remove: (id) => set((state) => ({items: state.items.filter((s) => s.id !== id)})),
    }),
    {
      name: 'trace-subscriptions',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({items: state.items}),
    },
  ),
);
