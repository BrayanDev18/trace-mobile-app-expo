# Roadmap del proyecto – App de Administración Financiera Personal

## Objetivo

Construir una aplicación móvil con **Expo + React Native** y un backend desarrollado en **Go**, con el objetivo principal de aprender tecnologías modernas mientras se desarrolla una aplicación que usaré diariamente.

La aplicación **no manejará dinero real**, pagos ni transferencias bancarias. Su propósito será ayudar al usuario a registrar, organizar y analizar sus finanzas personales.

---

# Stack Tecnológico

## Frontend

* Expo
* React Native
* TypeScript
* Expo Router
* TanStack Query
* React Hook Form
* Zod
* Zustand
* NativeWind (opcional)
* Victory Native o React Native Skia para gráficos

---

## Backend

* Go
* Chi (framework HTTP)
* MongoDB
* JWT Authentication
* Docker
* Docker Compose
* Air (Hot Reload)
* Swagger/OpenAPI

---

## Herramientas

* Git
* GitHub
* Postman o Bruno
* MongoDB Compass
* VS Code

---

# Filosofía del proyecto

La aplicación debe responder preguntas como:

* ¿En qué gasto más dinero?
* ¿Cuánto gasto al mes?
* ¿Cuánto logro ahorrar?
* ¿Qué categorías consumen la mayor parte de mis ingresos?
* ¿Cuánto dinero necesito para vivir un mes?
* ¿Qué suscripciones tengo activas?
* ¿Quién me debe dinero?
* ¿A quién le debo?
* ¿Qué recibos corresponden a cada gasto?

---

# Fase 1 – MVP

Objetivo: registrar ingresos y gastos.

## Funcionalidades

* Registro de usuario
* Inicio de sesión
* Registrar ingreso
* Registrar gasto
* Categorías
* Editar movimientos
* Eliminar movimientos
* Historial de movimientos
* Balance mensual
* Balance diario
* Balance anual

---

# Fase 2 – Estadísticas

Objetivo: visualizar información útil.

## Funcionalidades

* Gasto por categoría
* Gasto por día
* Gasto por semana
* Gasto por mes
* Comparación entre meses
* Promedio diario
* Promedio mensual
* Evolución del ahorro

Gráficos:

* Barras
* Circular
* Línea

---

# Fase 3 – Presupuestos

Objetivo: controlar cuánto se desea gastar.

Ejemplo:

Categoría: Comida

Presupuesto mensual

$700.000

Gastado

$520.000

Disponible

$180.000

Alertas:

* 75%
* 90%
* 100%

---

# Fase 4 – Dashboard

Pantalla principal con información resumida.

Widgets:

* Balance total
* Ingresos del mes
* Gastos del mes
* Ahorro
* Gasto promedio diario
* Categoría con mayor gasto
* Últimos movimientos
* Presupuesto restante

---

# Fase 5 – Reportes

Generación de reportes.

Filtros:

* Fecha inicial
* Fecha final
* Categoría
* Tipo

Exportar:

* PDF
* Excel
* CSV

---

# Fase 6 – Objetivos de ahorro

Permite crear metas.

Ejemplo

Comprar computador

Meta

$6.000.000

Ahorrado

$2.300.000

38%

---

# Fase 7 – Recordatorios

Notificaciones.

Ejemplos

* Registrar gastos del día
* Recordatorio semanal
* Presupuesto casi agotado
* Suscripción próxima a vencer

---

# Fase 8 – Gestión de deudas

Registrar dinero prestado.

Campos

* Persona
* Valor
* Fecha
* Descripción
* Estado
* Fecha límite
* Evidencia (opcional)

Tipos

* Me deben
* Yo debo

---

# Fase 9 – Suscripciones

Registrar pagos recurrentes.

Ejemplos

* Spotify
* Netflix
* ChatGPT
* GitHub Copilot
* iCloud

Campos

* Nombre
* Valor
* Frecuencia
* Próximo cobro
* Categoría
* Estado

Alertas antes del cobro.

---

# Fase 10 – Adjuntos

Cada gasto podrá almacenar evidencia.

Ejemplos

* Factura
* Recibo
* Garantía
* Captura de pantalla

Información adicional

* Imagen
* PDF
* Fecha
* Observaciones

Esto permitirá consultar meses después exactamente qué se compró.

---

# Fase 11 – Búsquedas y filtros

Buscar información fácilmente.

Filtros

* Fecha
* Categoría
* Valor
* Texto
* Etiquetas

Ejemplos

"Mostrar todos los gastos en restaurantes durante marzo."

"Mostrar compras mayores a $100.000."

---

# Fase 12 – Optimización y experiencia de usuario

Mejorar el producto.

Características

* Modo oscuro
* Animaciones
* Sincronización
* Caché
* Funcionamiento parcial sin conexión
* Mejor rendimiento
* Mejor accesibilidad

---

# Modelo de datos inicial

## Usuario

* id
* nombre
* email
* contraseña
* fecha de creación

---

## Categoría

* id
* nombre
* color
* icono
* tipo (Ingreso/Gasto)

---

## Movimiento

* id
* usuario
* tipo
* categoría
* descripción
* valor
* fecha
* notas
* ubicación (opcional)
* etiquetas
* archivo adjunto

---

## Presupuesto

* id
* categoría
* límite
* mes
* año

---

## Suscripción

* id
* nombre
* costo
* frecuencia
* próximo cobro
* categoría
* activa

---

## Deuda

* id
* persona
* tipo
* valor
* descripción
* fecha
* estado

---

## Objetivo

* id
* nombre
* meta
* ahorro actual
* fecha objetivo

---

# Arquitectura

```
React Native (Expo)

        │

TanStack Query

        │

REST API

        │

Go (Chi)

        │

Services

        │

Repositories

        │

MongoDB
```

---

# Estructura sugerida del backend

```
cmd/

internal/

    auth/

    users/

    transactions/

    categories/

    budgets/

    goals/

    debts/

    subscriptions/

    attachments/

    statistics/

    reports/

pkg/

configs/

docs/

docker/

```

---

# Lo que quiero aprender con este proyecto

## React Native

* Navegación
* Estado
* Formularios
* Consumo de APIs
* Caché
* Manejo de imágenes
* Notificaciones
* Offline

## Go

* Sintaxis
* Interfaces
* Structs
* Manejo de errores
* Concurrencia
* Context
* Arquitectura limpia
* Middleware
* JWT
* CRUD
* Testing

## MongoDB

* Modelado de documentos
* Índices
* Agregaciones
* Relaciones mediante referencias
* Optimización de consultas

---

# Visión final

El objetivo no es construir la aplicación financiera más compleja, sino una herramienta que realmente utilice todos los días para registrar y comprender mejor mis finanzas.

Cada nueva funcionalidad debe aportar valor real y, al mismo tiempo, representar una oportunidad para aprender una nueva tecnología o un nuevo concepto de desarrollo de software.

La meta es que, al finalizar el proyecto, haya construido una aplicación completa, mantenible y escalable, que además sirva como una pieza sólida de mi portafolio profesional y demuestre habilidades tanto en desarrollo móvil como en backend con Go.
