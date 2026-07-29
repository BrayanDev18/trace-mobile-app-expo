# Trace · Barrel files

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
