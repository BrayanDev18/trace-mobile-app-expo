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

## Separación de lógica (hooks)

Las screens son capa de presentación: conectan hooks + navegación + componen
componentes (máx. **120 líneas**; subcomponentes del mismo archivo van **debajo**
del principal). La lógica vive fuera según este criterio:

1. **Reutilizada en 2+ sitios** → hook (`src/hooks/` si es transversal,
   `features/<x>/hooks/` si es del feature).
2. **Concern completo con estado/efectos** (form + validación + submit,
   animación, data fetching) → hook aunque tenga un solo consumidor; la screen
   queda como puro layout.
3. **Sin reactividad de React** (funciones puras) → util, nunca hook
   (`src/utils/` o `features/<x>/utils.ts`).
4. **No extraer trivialidades**: un `useState` suelto, un derivado de una línea,
   un handler de 2 líneas. Un hook que devuelve más de ~6 valores son dos
   concerns → dividirlo.

Capas: componentes presentacionales (props in, callbacks out, no importan
stores) · hooks (lógica, consumen stores) · stores zustand (solo estado global)
· utils (funciones puras).

## Barrel files

Barrel = **contrato de un módulo**, no atajo de imports. En RN salen caros:
Metro no hace tree-shaking de re-exports (importar una cosa del barrel mete al
bundle todo lo que exporta) y los side effects a nivel módulo se ejecutan al
tocar el barrel (cold start).

1. Solo en módulos transversales (`src/components|utils|constants`) y como API
   pública de cada feature (`features/<x>/index.ts` exporta únicamente lo que
   consumen las rutas u otros features).
2. Solo **named exports**; nunca `export *`.
3. Cero side effects a nivel módulo en archivos barreleados (shaders, configs,
   datos pesados → archivo propio importado directo por su único consumidor).
4. Los archivos internos de un feature se importan entre sí directo, sin pasar
   por el barrel; sin barrels anidados.
5. Consistencia: si un módulo tiene barrel, siempre se importa por el barrel.

