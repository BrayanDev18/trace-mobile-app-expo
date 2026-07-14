import {create} from 'zustand';
import {createJSONStorage, persist, type PersistOptions} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ListState<T extends {id: string}> = {
  items: T[];
  add: (data: Omit<T, 'id'>) => T;
  remove: (id: string) => void;
};

type ListPersist<T extends {id: string}> = Pick<
  PersistOptions<ListState<T>, {items: T[]}>,
  'version' | 'migrate'
>;

/**
 * Store persistido de lista con `id` generado dentro del store (las
 * pantallas nunca fabrican ids ni fechas: mantiene los componentes puros).
 */
export const createPersistedListStore = <T extends {id: string}>(
  storageKey: string,
  options?: ListPersist<T>,
) =>
  create<ListState<T>>()(
    persist(
      (set) => ({
        items: [],
        add: (data) => {
          const item = {...data, id: String(Date.now())} as T;
          set((state) => ({items: [item, ...state.items]}));
          return item;
        },
        remove: (id) => set((state) => ({items: state.items.filter((item) => item.id !== id)})),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({items: state.items}),
        ...options,
      },
    ),
  );