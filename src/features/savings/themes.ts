import {
  IconPlane,
  IconHome,
  IconCar,
  IconDeviceLaptop,
  IconSchool,
  IconShieldCheck,
  IconGift,
  IconPigMoney,
  type Icon,
} from '@tabler/icons-react-native';

export type SavingThemeProps = {
  id: string;
  labelKey: string;
  icon: Icon;
  tint: string;
};

export const SAVING_THEMES: SavingThemeProps[] = [
  {id: 'travel', labelKey: 'savings:themes.travel', icon: IconPlane, tint: '#0ea5e9'},
  {id: 'home', labelKey: 'savings:themes.home', icon: IconHome, tint: '#8b5cf6'},
  {id: 'vehicle', labelKey: 'savings:themes.vehicle', icon: IconCar, tint: '#208aef'},
  {id: 'tech', labelKey: 'savings:themes.tech', icon: IconDeviceLaptop, tint: '#6366f1'},
  {id: 'education', labelKey: 'savings:themes.education', icon: IconSchool, tint: '#f97316'},
  {id: 'emergency', labelKey: 'savings:themes.emergency', icon: IconShieldCheck, tint: '#ef4444'},
  {id: 'gift', labelKey: 'savings:themes.gift', icon: IconGift, tint: '#d946ef'},
  {id: 'other', labelKey: 'savings:themes.other', icon: IconPigMoney, tint: '#5c636d'},
];

const OTHER_THEME = SAVING_THEMES[SAVING_THEMES.length - 1];

export const getSavingTheme = (id: string): SavingThemeProps =>
  SAVING_THEMES.find((t) => t.id === id) ?? OTHER_THEME;