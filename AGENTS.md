# Trace · Contrato para agentes

App móvil de **finanzas personales**: registrar y analizar ingresos, gastos y
compromisos para entender el dinero. No es una billetera ni procesa dinero real.

Las normas del proyecto viven en `foundations/`. Léelas antes de escribir código;
sus reglas prevalecen sobre defaults, plantillas y skills genéricos.

| Documento | Qué fija | Cuándo leerlo |
| --- | --- | --- |
| [product.md](foundations/product.md) | Qué es Trace, alcance, funcionalidades | siempre |
| [stack.md](foundations/stack.md) | Tecnologías y restricciones de dependencias | siempre |
| [architecture.md](foundations/architecture.md) | Capas, features, separación de lógica | siempre |
| [conventions.md](foundations/conventions.md) | Naming, comentarios, forma de las props | siempre |
| [barrels.md](foundations/barrels.md) | Qué se exporta y desde dónde | al tocar imports |
| [ui.md](foundations/ui.md) | Estilado, clases semánticas, tema | al escribir UI |
| [i18n.md](foundations/i18n.md) | Catálogos y reglas de strings | al añadir texto |
| [design.md](foundations/design.md) | Sistema de diseño **bloqueado** | **obligatorio** antes de tocar UI |

`design.md` no se autocarga por tamaño: ábrelo tú antes de escribir o modificar
cualquier UI. El resto entra en contexto automáticamente:

@foundations/product.md
@foundations/stack.md
@foundations/architecture.md
@foundations/conventions.md
@foundations/barrels.md
@foundations/ui.md
@foundations/i18n.md
