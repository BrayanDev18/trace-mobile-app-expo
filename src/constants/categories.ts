import {
  IconToolsKitchen2,
  IconCar,
  IconRepeat,
  IconShoppingCart,
  IconHome,
  IconHeartbeat,
  IconBolt,
  IconBook,
  IconDeviceGamepad2,
  IconDots,
  IconBriefcase,
  IconDeviceLaptop,
  IconBuildingStore,
  IconTrendingUp,
  IconGift,
  IconArrowBackUp,
  type Icon,
} from '@tabler/icons-react-native';

export type CategoryKind = 'expense' | 'income';

export type Category = {
  id: string;
  label: string;
  icon: Icon;
  tint: string;
  kind: CategoryKind;
};

export const CATEGORIES: Category[] = [
  {id: 'food', label: 'Comida', icon: IconToolsKitchen2, tint: '#f4c24e', kind: 'expense'},
  {id: 'transport', label: 'Transporte', icon: IconCar, tint: '#208aef', kind: 'expense'},
  {id: 'subscriptions', label: 'Suscripciones', icon: IconRepeat, tint: '#0f6b43', kind: 'expense'},
  {id: 'shopping', label: 'Compras', icon: IconShoppingCart, tint: '#e0559d', kind: 'expense'},
  {id: 'home', label: 'Hogar', icon: IconHome, tint: '#8b5cf6', kind: 'expense'},
  {id: 'health', label: 'Salud', icon: IconHeartbeat, tint: '#ef4444', kind: 'expense'},
  {id: 'services', label: 'Servicios', icon: IconBolt, tint: '#14b8a6', kind: 'expense'},
  {id: 'education', label: 'Educación', icon: IconBook, tint: '#f97316', kind: 'expense'},
  {id: 'leisure', label: 'Ocio', icon: IconDeviceGamepad2, tint: '#6366f1', kind: 'expense'},
  {id: 'other', label: 'Otros', icon: IconDots, tint: '#5c636d', kind: 'expense'},
  {id: 'salary', label: 'Salario', icon: IconBriefcase, tint: '#22c55e', kind: 'income'},
  {id: 'freelance', label: 'Freelance', icon: IconDeviceLaptop, tint: '#0ea5e9', kind: 'income'},
  {id: 'sales', label: 'Ventas', icon: IconBuildingStore, tint: '#f59e0b', kind: 'income'},
  {id: 'investments', label: 'Inversiones', icon: IconTrendingUp, tint: '#a855f7', kind: 'income'},
  {id: 'gift', label: 'Regalo', icon: IconGift, tint: '#d946ef', kind: 'income'},
  {id: 'refund', label: 'Reembolso', icon: IconArrowBackUp, tint: '#06b6d4', kind: 'income'},
  {id: 'other-income', label: 'Otros', icon: IconDots, tint: '#5c636d', kind: 'income'},
];

export const categoriesByKind = (kind: CategoryKind): Category[] =>
  CATEGORIES.filter((c) => c.kind === kind);

const CATEGORIES_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const OTHER_CATEGORY = CATEGORIES_BY_ID.other;

export const getCategory = (id: string): Category =>
  CATEGORIES_BY_ID[id] ?? OTHER_CATEGORY;
