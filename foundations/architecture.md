# Trace · Arquitectura

## Principios

Código limpio y mantenible · arquitectura escalable · separación clara de
responsabilidades · cada feature como módulo aislado · crecer sin grandes
refactors · UX sencilla, moderna e intuitiva.

## Capas

- **Componentes presentacionales**: props in, callbacks out. No importan stores.
- **Hooks**: la lógica. Consumen stores.
- **Stores Zustand**: solo estado global.
- **Utils**: funciones puras.

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
