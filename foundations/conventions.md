# Trace · Convenciones de código

## Naming

**Todo `type` declarado en el proyecto termina en `Props`** — no solo los de
componentes: `MovementProps`, `SubscriptionProps`, `PanelProps`. Se renombra al
declarar, no al usar.

## Comentarios

**Cero comentarios en el código**: ni bloques `/** */` ni `//`. El código se
explica con nombres; lo que necesite contexto de producto va en `foundations/`
o en el doc correspondiente, no inline.

## Forma de las props

Cuando un componente tiene **más de tres props**, la firma recibe el objeto
completo y la destructuración va en la primera línea del cuerpo, incluyendo
defaults y renombres:

```tsx
export const Header = (props: HeaderProps) => {
  const {title, leftIcon: LeftIcon = IconChevronLeft, onBack = router.back} = props;
};
```

Con tres props o menos, la destructuración inline en la firma está bien.
Referencia: `src/components/Screen.tsx`, `src/components/Header.tsx`.
