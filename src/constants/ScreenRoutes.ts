import {router} from 'expo-router';
import type {Href} from 'expo-router';

/**
 * Registro central de rutas de Trace. Úsalo con {@link navigate} o
 * `router.push(ScreenRoutes.x)` en vez de esparcir strings literales.
 *
 * Los grupos de Expo Router — (public), (protected), (tabs) — son solo
 * organización de archivos y NO aparecen en la URL. Por eso `/home`, no
 * `/(protected)/(tabs)/home`.
 *
 * ✅ = pantalla existente · 🚧 = planificada (crear el archivo antes de navegar)
 */
export const ScreenRoutes = {
  // Público
  onboarding: '/onboarding',   // ✅
  login: '/login',             // 🚧
  register: '/register',       // 🚧

  // Tabs protegidas
  home: '/home',               // ✅ dashboard
  movements: '/movements',     // 🚧 historial de movimientos
  stats: '/stats',             // 🚧 estadísticas y gráficos
  profile: '/profile',         // 🚧

  // Flujos de movimientos
  expenses: '/expenses',           // ✅ gastos por día (calendario horizontal)
  newExpense: '/expenses/new',     // ✅ formulario de nuevo gasto
  newMovement: '/movements/new',   // 🚧 registrar ingreso/gasto

  // Gestión
  categories: '/categories',       // 🚧
  budgets: '/budgets',             // 🚧 presupuestos por categoría
  goals: '/goals',                 // 🚧 objetivos de ahorro
  debts: '/debts',                 // 🚧 prestado / pendiente
  subscriptions: '/subscriptions',        // ✅ pagos recurrentes
  newSubscription: '/subscriptions/new',  // ✅ agregar suscripción
  search: '/search',               // 🚧 búsqueda avanzada
  settings: '/settings',           // 🚧
} as const;

/** Builders para rutas dinámicas con parámetro. */
export const DynamicRoutes = {
  expense: (id: string) => `/expenses/${id}` as Href,
  subscription: (id: string) => `/subscriptions/${id}` as Href,
  movement: (id: string) => `/movements/${id}` as Href,
  category: (id: string) => `/categories/${id}` as Href,
  budget: (id: string) => `/budgets/${id}` as Href,
  debt: (id: string) => `/debts/${id}` as Href,
} as const;

/** Push a una pantalla estática por su clave — evita typos en los paths. */
export const navigate = (screen: keyof typeof ScreenRoutes) => {
  router.push(ScreenRoutes[screen] as Href);
};
