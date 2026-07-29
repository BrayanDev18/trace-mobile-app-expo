import {auth} from './locales/auth';
import {categories} from './locales/categories';
import {common} from './locales/common';
import {debts} from './locales/debts';
import {expenses} from './locales/expenses';
import {home} from './locales/home';
import {savings} from './locales/savings';
import {movements} from './locales/movements';
import {onboarding} from './locales/onboarding';
import {payments} from './locales/payments';
import {profile} from './locales/profile';
import {stats} from './locales/stats';
import {subscriptions} from './locales/subscriptions';
import {welcome} from './locales/welcome';

export const resources = {
  es: {
    auth: auth.es,
    categories: categories.es,
    common: common.es,
    debts: debts.es,
    expenses: expenses.es,
    home: home.es,
    savings: savings.es,
    movements: movements.es,
    onboarding: onboarding.es,
    payments: payments.es,
    profile: profile.es,
    stats: stats.es,
    subscriptions: subscriptions.es,
    welcome: welcome.es,
  },
  en: {
    auth: auth.en,
    categories: categories.en,
    common: common.en,
    debts: debts.en,
    expenses: expenses.en,
    home: home.en,
    savings: savings.en,
    movements: movements.en,
    onboarding: onboarding.en,
    payments: payments.en,
    profile: profile.en,
    stats: stats.en,
    subscriptions: subscriptions.en,
    welcome: welcome.en,
  },
} as const;
