import {router} from 'expo-router';
import type {Href} from 'expo-router';

export const ScreenRoutes = {
  onboarding: '/onboarding',
  signIn: '/sign-in',
  signUp: '/sign-up',
  verifyCode: '/verify-code',

  welcome: '/welcome',
  home: '/home',
  movements: '/movements',
  stats: '/stats',
  explore: '/explore',
  profile: '/profile',

  expenses: '/expenses',
  newExpense: '/expenses/new',
  newIncome: '/income/new',
  newMovement: '/movements/new',

  categories: '/categories',
  budgets: '/budgets',
  debts: '/debts',
  newDebt: '/debts/new',
  savings: '/savings',
  newSaving: '/savings/new',
  subscriptions: '/subscriptions',
  newSubscription: '/subscriptions/new',
  search: '/search',
  settings: '/settings',
} as const;

export const DynamicRoutes = {
  expense: (id: string) => `/expenses/${id}` as Href,
  subscription: (id: string) => `/subscriptions/${id}` as Href,
  saving: (id: string) => `/savings/${id}` as Href,
  movement: (id: string) => `/movements/${id}` as Href,
  category: (id: string) => `/categories/${id}` as Href,
  budget: (id: string) => `/budgets/${id}` as Href,
  debt: (id: string) => `/debts/${id}` as Href,
} as const;

export const navigate = (screen: keyof typeof ScreenRoutes) => {
  router.push(ScreenRoutes[screen] as Href);
};
