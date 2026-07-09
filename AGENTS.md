# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.


# Trace

**"Sigue el rastro de tu dinero para tomar mejores decisiones financieras."**

App móvil de **finanzas personales**: registrar y analizar ingresos, gastos y
compromisos financieros para entender y administrar el dinero.

> NO es una billetera ni procesa pagos/dinero real. Solo registra y analiza.

Debe ayudar a responder: ¿en qué gasto más?, ¿cuánto gasto/ahorro al mes?, ¿qué
categorías consumen mis ingresos?, ¿cuánto en suscripciones?, ¿quién me debe / a
quién le debo?, ¿dónde está el recibo de una compra vieja?

Es también un proyecto de **aprendizaje** (móvil, Go, MongoDB, arquitectura).
Al recomendar, prioriza soluciones escalables, mantenibles y de uso profesional;
explica el porqué de las decisiones arquitectónicas y evita atajos que dificulten
el crecimiento futuro.

## Funcionalidades

Auth · ingresos · gastos · categorías personalizables · historial de movimientos
· dashboard con métricas · estadísticas con gráficos · presupuestos por categoría
· objetivos de ahorro · gestión de deudas (prestado/pendiente) · suscripciones y
pagos recurrentes · adjuntar imágenes/archivos (facturas, recibos, garantías) a
cada movimiento · búsqueda avanzada y filtros · exportación de reportes ·
notificaciones y recordatorios.

## Stack

**Frontend:** Expo · React Native · TypeScript · Expo Router · TanStack Query ·
React Hook Form · Zod · Zustand (solo estado global de UI). Arquitectura
feature-based (cada funcionalidad = módulo independiente).

**Backend:** Go, API REST en capas (Handlers → Services → Repositories) · JWT ·
MongoDB · Docker · Swagger/OpenAPI.

## Diseño

El sistema de diseño bloqueado vive en `design.md` (raíz del repo). Léelo antes
de escribir o modificar cualquier UI; sus reglas prevalecen sobre defaults y
skills de diseño genéricos.

## Principios

Código limpio y mantenible · arquitectura escalable · separación clara de
responsabilidades · cada feature como módulo aislado · crecer sin grandes
refactors · UX sencilla, moderna e intuitiva.

