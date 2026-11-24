import {
  IconCar,
  IconDeviceGamepad2,
  IconDots,
  IconHeartbeat,
  IconHome,
  IconToolsKitchen2,
  IconUsers,
  IconWallet,
  type Icon,
} from '@tabler/icons-react-native';

export type BudgetThemeProps = {
  id: string;
  labelKey: string;
  icon: Icon;
  tint: string;
};

export const BUDGET_THEMES: BudgetThemeProps[] = [
  {id: 'essentials', labelKey: 'budgets:themes.essentials', icon: IconHome, tint: '#8b5cf6'},
  {id: 'food', labelKey: 'budgets:themes.food', icon: IconToolsKitchen2, tint: '#f4c24e'},
  {id: 'transport', labelKey: 'budgets:themes.transport', icon: IconCar, tint: '#208aef'},
  {id: 'leisure', labelKey: 'budgets:themes.leisure', icon: IconDeviceGamepad2, tint: '#6366f1'},
  {id: 'health', labelKey: 'budgets:themes.health', icon: IconHeartbeat, tint: '#ef4444'},
  {id: 'family', labelKey: 'budgets:themes.family', icon: IconUsers, tint: '#0ea5e9'},
  {id: 'personal', labelKey: 'budgets:themes.personal', icon: IconWallet, tint: '#14b8a6'},
  {id: 'other', labelKey: 'budgets:themes.other', icon: IconDots, tint: '#5c636d'},
];

const OTHER_THEME = BUDGET_THEMES[BUDGET_THEMES.length - 1];

export const getBudgetTheme = (id: string): BudgetThemeProps =>
  BUDGET_THEMES.find((theme) => theme.id === id) ?? OTHER_THEME;
