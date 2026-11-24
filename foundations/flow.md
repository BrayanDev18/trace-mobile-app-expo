# Trace · Flujo del dinero

Cómo se relacionan los módulos entre sí. `product.md` dice **qué** hay;
este archivo dice **cómo encaja** y por qué cada módulo existe.

## El eje: registrar → trackear → ver

Trace resuelve una cosa y la resuelve bien: **saber en qué se va el dinero**.
Todo lo demás existe solo si sirve a ese eje.

1. **Registrar** — capturar un gasto tiene que costar segundos, sin prerrequisitos.
2. **Trackear** — cada movimiento cae en una categoría y en un ciclo, sin trabajo extra.
3. **Ver** — historial, estadísticas y el disponible del ciclo cuentan la historia.

Trace **no decide por el usuario**: no fija topes automáticos ni le dice cuánto
debería gastar. El que organiza es el usuario: puede repartir su ingreso del
ciclo en **presupuestos** (método de sobres del mundo financiero real) y elegir
de qué sobre sale cada gasto; Trace registra, descuenta y avisa cuando un sobre
se queda sin fondos. Cualquier feature que empiece a decidir por el usuario está
fuera del eje.

## Una sola ecuación

El ciclo de pago es la columna vertebral. Todo número que la app muestre es una
proyección de esta ecuación, nunca una verdad paralela:

```
Ingreso del ciclo
− Comprometido     suscripciones que cobran en el ciclo
                   + deuda propia que vence en el ciclo
                   + aporte a ahorro planeado
− Gastado          movimientos del ciclo que no son pago de un compromiso
= Disponible       el número grande del home
```

Los presupuestos no cambian la ecuación: **reparten** `Ingreso` en sobres y leen
`Gastado` por sobre. `Por asignar = Ingreso − Σ asignado` y `Disponible del
sobre = asignado − gastado del sobre` son proyecciones de la misma ecuación,
nunca una verdad paralela.

## Rol de cada módulo

Cada módulo entra en la ecuación en un solo punto. Si dos módulos responden lo
mismo, uno sobra.

| Módulo | Rol | Efecto |
| --- | --- | --- |
| Movimientos | materia prima | alimenta `Gastado` / `Ingreso` |
| Categorías | lente de lectura | agrupan el gasto; no imponen límites |
| Presupuestos | sobres del ingreso | reparten `Ingreso`; el gasto elige de qué sobre sale |
| Estadísticas | visibilidad | leen movimientos del ciclo; no calculan nada nuevo |
| Suscripciones | compromiso recurrente | suma a `Comprometido`; el cobro se convierte en movimiento |
| Deuda propia (`owed`) | compromiso con fecha | suma a `Comprometido` si vence en el ciclo |
| Deuda ajena (`lent`) | activo por cobrar | no toca el ciclo; entra como ingreso al cobrarse |
| Ahorro | compromiso voluntario | suma a `Comprometido`: págate primero |

## Invariantes

1. **Un solo ciclo.** Ningún módulo calcula su propio periodo ni cae a mes
   calendario. Todos leen el ciclo activo de `features/income`.
2. **Nada se cuenta dos veces.** El pago de un compromiso (cobro de suscripción,
   abono a deuda, aporte a ahorro) es un movimiento ligado a su origen, no un
   gasto suelto de categoría.
3. **Las fechas se guardan en ISO.** Lo que se formatea con `shortDate` es para
   mostrar, nunca para persistir ni comparar.
4. **El ahorro es compromiso, no sobrante.** Si compite contra el gasto libre,
   pierde siempre.
5. **Registrar nunca se bloquea.** Ninguna pantalla exige configuración previa
   para poder capturar un gasto.
6. **Los presupuestos reparten, no crean dinero.** La suma asignada se contrasta
   con el ingreso del ciclo («por asignar» puede quedar en negativo y se ve en
   rojo); un sobre sin fondos **avisa**, nunca bloquea el registro (invariante 5).
   Elegir sobre es opcional: un gasto sin presupuesto sigue siendo un gasto.

## Progresión

La app no exige configuración: cada capa se desbloquea cuando los datos la
justifican. Una sola app para novatos y expertos; lo que cambia es el punto de
entrada, no el modo.

| Momento | Qué puede hacer el usuario |
| --- | --- |
| Día 1 | registrar gastos e ingresos, sin configurar nada |
| Con movimientos | historial y estadísticas reales; la app propone el ciclo detectado, saltable |
| Con ciclo activo | disponible real, compromisos, presupuestos, cierre de ciclo |

## Qué evitar

Topes automáticos o cualquier variante de «cuánto deberías gastar» dictada por
la app — el reparto lo hace el usuario, Trace solo lo refleja · presupuestos que
bloqueen el registro de un gasto · dos tarjetas en el home que respondan lo
mismo con marcos distintos · selectores de periodo que compitan con el ciclo ·
módulos nuevos con su propia definición de tiempo · pasos obligatorios en el
onboarding.
