# Trace · Producto

**"Sigue el rastro de tu dinero para tomar mejores decisiones financieras."**

App móvil de **finanzas personales**: registrar y analizar ingresos, gastos y
compromisos financieros para entender y administrar el dinero.

> NO es una billetera ni procesa pagos/dinero real. Solo registra y analiza.

Debe ayudar a responder: ¿en qué gasto más?, ¿cuánto gasto/ahorro al mes?, ¿qué
categorías consumen mis ingresos?, ¿cuánto en suscripciones?, ¿quién me debe / a
quién le debo?, ¿dónde está el recibo de una compra vieja?

## Principio rector

**Todo funciona como en el mundo real del manejo de finanzas personales.** Cada
módulo modela una práctica financiera reconocible —ciclo de pago, presupuestos
por sobres, ahorro como «págate primero», deudas por cobrar/pagar— con el
comportamiento que esa práctica tiene fuera de la app. Si una feature no tiene
equivalente en cómo la gente administra su dinero, no entra; si lo tiene, se
implementa fiel a esa práctica, no a una versión inventada.

Es también un proyecto de **aprendizaje** (móvil, Go, MongoDB, arquitectura).
Al recomendar, prioriza soluciones escalables, mantenibles y de uso profesional;
explica el porqué de las decisiones arquitectónicas y evita atajos que dificulten
el crecimiento futuro.

## Funcionalidades

Auth · ingresos · gastos · categorías personalizables · historial de movimientos
· dashboard con métricas · estadísticas con gráficos · presupuestos por sobres
(repartir el ingreso del ciclo y saber de dónde sale cada gasto) · objetivos de
ahorro · gestión de deudas (prestado/pendiente) · suscripciones y pagos
recurrentes · adjuntar imágenes/archivos (facturas, recibos, garantías) a cada
movimiento · búsqueda avanzada y filtros · exportación de reportes ·
notificaciones y recordatorios.

Fuera de alcance: **que la app decida por el usuario**. Trace no fija topes
automáticos ni dicta cuánto gastar: el usuario reparte su ingreso en
presupuestos y Trace muestra cómo va. Ver [flow.md](flow.md).
