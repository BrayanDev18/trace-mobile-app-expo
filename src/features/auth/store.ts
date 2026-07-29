import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AccountProps = {
  fullName: string;
  email: string;
  password: string;
};

type AccountsStateProps = {
  accounts: AccountProps[];
  register: (account: AccountProps) => void;
  findByEmail: (email: string) => AccountProps | undefined;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const useAccountsStore = create<AccountsStateProps>()(
  persist(
    (set, get) => ({
      accounts: [],
      register: (account) =>
        set((state) => ({
          accounts: [...state.accounts, {...account, email: normalizeEmail(account.email)}],
        })),
      findByEmail: (email) =>
        get().accounts.find((account) => account.email === normalizeEmail(email)),
    }),
    {
      name: 'trace-accounts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({accounts: state.accounts}),
    },
  ),
);