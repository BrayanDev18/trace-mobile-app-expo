export const budgets = {
  es: {
    title: 'Presupuestos',
    cycleTitle: 'Este ciclo',
    summary: '{{spent}} de {{cap}}',
    add: 'Nuevo tope',
    chooseCategory: 'Elige una categoría',
    empty: {
      title: 'Sin topes aún',
      body: 'Ponle un límite por categoría a cada ciclo y mira cómo vas antes de gastar de más.',
    },
    fromHistory: 'Crear desde mi gasto anterior',
    bootstrap: {
      confirmTitle: 'Usar tu historial',
      confirmBody_one:
        'Creamos {{count}} tope con lo que gastaste el ciclo pasado. Luego lo ajustas a tu medida.',
      confirmBody_other:
        'Creamos {{count}} topes con lo que gastaste el ciclo pasado. Luego los ajustas a tu medida.',
      action: 'Crear',
    },
    remove: 'Quitar tope',
    removeConfirmTitle: '¿Quitar este tope?',
    removeConfirmBody: 'La categoría quedará sin límite en tus ciclos.',
  },
  en: {
    title: 'Budgets',
    cycleTitle: 'This cycle',
    summary: '{{spent}} of {{cap}}',
    add: 'New cap',
    chooseCategory: 'Pick a category',
    empty: {
      title: 'No caps yet',
      body: 'Set a per-category limit for each cycle and see where you stand before overspending.',
    },
    fromHistory: 'Create from my past spending',
    bootstrap: {
      confirmTitle: 'Use your history',
      confirmBody_one:
        "We'll create {{count}} cap from what you spent last cycle. You can adjust it anytime.",
      confirmBody_other:
        "We'll create {{count}} caps from what you spent last cycle. You can adjust them anytime.",
      action: 'Create',
    },
    remove: 'Remove cap',
    removeConfirmTitle: 'Remove this cap?',
    removeConfirmBody: 'The category will have no limit in your cycles.',
  },
};
