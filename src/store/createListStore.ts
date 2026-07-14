import {create} from 'zustand';
import {createJSONStorage, persist, type PersistOptions} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ListStateProps<T extends {id: string}> = {
  items: T[];
  add: (data: Omit<T, 'id'>) => T;
  remove: (id: string) => void;
};

type ListPersistProps<T extends {id: string}> = Pick<
  PersistOptions<ListStateProps<T>, {items: T[]}>,
  'version' | 'migrate'
>;

export const createPersistedListStore = <T extends {id: string}>(
  storageKey: string,
  options?: ListPersistProps<T>,
) =>
  create<ListStateProps<T>>()(
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