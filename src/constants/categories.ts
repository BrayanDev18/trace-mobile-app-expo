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

export type CategoryKindProps = 'expense' | 'income';

export type CategoryProps = {
  id: string;
  labelKey: string;
  icon: Icon;
  tint: string;
  kind: CategoryKindProps;
};

const CATEGORIES: CategoryProps[] = [
  {id: 'food', labelKey: 'categories:food', icon: IconToolsKitchen2, tint: '#f4c24e', kind: 'expense'},
  {id: 'transport', labelKey: 'categories:transport', icon: IconCar, tint: '#208aef', kind: 'expense'},
  {id: 'subscriptions', labelKey: 'categories:subscriptions', icon: IconRepeat, tint: '#0f6b43', kind: 'expense'},
  {id: 'shopping', labelKey: 'categories:shopping', icon: IconShoppingCart, tint: '#e0559d', kind: 'expense'},
  {id: 'home', labelKey: 'categories:home', icon: IconHome, tint: '#8b5cf6', kind: 'expense'},
  {id: 'health', labelKey: 'categories:health', icon: IconHeartbeat, tint: '#ef4444', kind: 'expense'},
  {id: 'services', labelKey: 'categories:services', icon: IconBolt, tint: '#14b8a6', kind: 'expense'},
  {id: 'education', labelKey: 'categories:education', icon: IconBook, tint: '#f97316', kind: 'expense'},
  {id: 'leisure', labelKey: 'categories:leisure', icon: IconDeviceGamepad2, tint: '#6366f1', kind: 'expense'},
  {id: 'other', labelKey: 'categories:other', icon: IconDots, tint: '#5c636d', kind: 'expense'},
  {id: 'salary', labelKey: 'categories:salary', icon: IconBriefcase, tint: '#22c55e', kind: 'income'},
  {id: 'freelance', labelKey: 'categories:freelance', icon: IconDeviceLaptop, tint: '#0ea5e9', kind: 'income'},
  {id: 'sales', labelKey: 'categories:sales', icon: IconBuildingStore, tint: '#f59e0b', kind: 'income'},
  {id: 'investments', labelKey: 'categories:investments', icon: IconTrendingUp, tint: '#a855f7', kind: 'income'},
  {id: 'gift', labelKey: 'categories:gift', icon: IconGift, tint: '#d946ef', kind: 'income'},
  {id: 'refund', labelKey: 'categories:refund', icon: IconArrowBackUp, tint: '#06b6d4', kind: 'income'},
  {id: 'other-income', labelKey: 'categories:other-income', icon: IconDots, tint: '#5c636d', kind: 'income'},
];

export const categoriesByKind = (kind: CategoryKindProps): CategoryProps[] =>
  CATEGORIES.filter((c) => c.kind === kind);

const CATEGORIES_BY_ID: Record<string, CategoryProps> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

const OTHER_CATEGORY = CATEGORIES_BY_ID.other;

export const getCategory = (id: string): CategoryProps =>
  CATEGORIES_BY_ID[id] ?? OTHER_CATEGORY;
