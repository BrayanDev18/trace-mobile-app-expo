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
  type Icon,
} from '@tabler/icons-react-native';

export type Category = {
  id: string;
  label: string;
  icon: Icon;
  tint: string;
};

export const CATEGORIES: Category[] = [
  {id: 'food', label: 'Comida', icon: IconToolsKitchen2, tint: '#f4c24e'},
  {id: 'transport', label: 'Transporte', icon: IconCar, tint: '#208aef'},
  {id: 'subscriptions', label: 'Suscripciones', icon: IconRepeat, tint: '#0f6b43'},
  {id: 'shopping', label: 'Compras', icon: IconShoppingCart, tint: '#e0559d'},
  {id: 'home', label: 'Hogar', icon: IconHome, tint: '#8b5cf6'},
  {id: 'health', label: 'Salud', icon: IconHeartbeat, tint: '#ef4444'},
  {id: 'services', label: 'Servicios', icon: IconBolt, tint: '#14b8a6'},
  {id: 'education', label: 'Educación', icon: IconBook, tint: '#f97316'},
  {id: 'leisure', label: 'Ocio', icon: IconDeviceGamepad2, tint: '#6366f1'},
  {id: 'other', label: 'Otros', icon: IconDots, tint: '#5c636d'},
];

const CATEGORIES_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const OTHER_CATEGORY = CATEGORIES_BY_ID.other;

export const getCategory = (id: string): Category =>
  CATEGORIES_BY_ID[id] ?? OTHER_CATEGORY;