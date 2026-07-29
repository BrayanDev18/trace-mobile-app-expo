# Trace · Stack

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before
writing any code. Lo que recuerdes de SDKs anteriores no aplica.

## Frontend

Expo · React Native · TypeScript · Expo Router · TanStack Query · React Hook Form
· Zod · Zustand (solo estado global de UI). Arquitectura feature-based (cada
funcionalidad = módulo independiente).

Estilado con NativeWind v5 (Tailwind v4) — ver [ui.md](ui.md).
Internacionalización con react-i18next — ver [i18n.md](i18n.md).

## Backend

Go, API REST en capas (Handlers → Services → Repositories) · JWT · MongoDB ·
Docker · Swagger/OpenAPI. Detalle y criterios de adopción en
[../docs/backend-stack.md](../docs/backend-stack.md).

## Restricciones de dependencias

**`lightningcss` pineado a 1.30.1** vía `overrides` en `package.json`.
`react-native-css` (motor de NativeWind v5) marca 1.30.2 como bug crítico que
rompe la compilación: el bundle falla con `failed to deserialize; expected an
object-like struct named Specifier, found ()`. Como `react-native-css` resuelve
lightningcss desde `@expo/metro-config`, un bump transitivo puede reintroducirlo.
Si vuelve ese error: verificar que `node_modules/lightningcss/package.json` sea
1.30.1 (JS y binario nativo), confirmar el `overrides`, reinstalar y limpiar caché
de Metro (`npx expo start -c`).

**`bunx install-skia` después de cada `bun install` / `bun remove`.**
`@shopify/react-native-skia` baja sus binarias prebuilt en un `postinstall` que
Bun no ejecuta de forma fiable (ni con el paquete en `trustedDependencies`), y
cualquier reescritura de `node_modules` deja `libs/` vacío. Síntoma: `pod install`
o `expo run:ios` revientan con `Skia prebuilt binaries not found`. Fix: correr
`bunx install-skia` y volver a `pod install`.
