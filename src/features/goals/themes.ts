import {
  IconPlane,
  IconHome,
  IconCar,
  IconDeviceLaptop,
  IconSchool,
  IconShieldCheck,
  IconGift,
  IconTargetArrow,
  type Icon,
} from '@tabler/icons-react-native';

export type GoalThemeProps = {
  id: string;
  label: string;
  icon: Icon;
  tint: string;
};

export const GOAL_THEMES: GoalThemeProps[] = [
  {id: 'travel', label: 'Viaje', icon: IconPlane, tint: '#0ea5e9'},
  {id: 'home', label: 'Hogar', icon: IconHome, tint: '#8b5cf6'},
  {id: 'vehicle', label: 'Vehículo', icon: IconCar, tint: '#208aef'},
  {id: 'tech', label: 'Tecnología', icon: IconDeviceLaptop, tint: '#6366f1'},
  {id: 'education', label: 'Educación', icon: IconSchool, tint: '#f97316'},
  {id: 'emergency', label: 'Emergencias', icon: IconShieldCheck, tint: '#ef4444'},
  {id: 'gift', label: 'Regalo', icon: IconGift, tint: '#d946ef'},
  {id: 'other', label: 'Otra', icon: IconTargetArrow, tint: '#5c636d'},
];

const OTHER_THEME = GOAL_THEMES[GOAL_THEMES.length - 1];

export const getGoalTheme = (id: string): GoalThemeProps =>
  GOAL_THEMES.find((t) => t.id === id) ?? OTHER_THEME;
