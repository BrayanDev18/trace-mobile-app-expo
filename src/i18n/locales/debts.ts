export const debts = {
  es: {
    title: 'Deudas',
    newDebt: 'Nueva deuda',
    sections: {
      lent: 'Me deben',
      owed: 'Yo debo',
    },
    empty: {
      title: 'Sin deudas activas',
      subtitle: 'Registra lo que te deben o lo que debes',
    },
    form: {
      personPlaceholder: '¿Con quién? (Ana, Carlos…)',
      submit: 'Registrar deuda',
    },
    source: {
      label: 'Salió de',
      pick: 'Origen del dinero',
      income: 'Ingresos',
      total: 'Valor total',
    },
    overview: {
      title: 'Balance de deudas',
      meta_one: 'Te deben $ {{lent}} · Debes $ {{owed}} · {{count}} activa',
      meta_other: 'Te deben $ {{lent}} · Debes $ {{owed}} · {{count}} activas',
    },
    card: {
      lent: 'Te debe',
      owed: 'Le debes',
      due: ' · vence {{date}}',
      ofAmount: 'de ${{amount}}',
    },
    detail: {
      title: 'Deuda',
      heroLent: '{{person}} te debe',
      heroOwed: 'Le debes a {{person}}',
      progress: 'Abonado ${{paid}} de ${{amount}}',
      payCta: 'Registrar abono',
      payShort: 'Abonar',
      rows: {
        original: 'Monto original',
        created: 'Registrada',
        agreed: 'Fecha acordada',
      },
      payments: {
        title: 'Abonos',
        empty: 'Sin abonos todavía',
        hint: 'Mantén presionado un abono para eliminarlo.',
      },
      settle: {
        label: 'Marcar como saldada',
        caption: 'Dejará de aparecer en tus deudas activas; su historial se conserva.',
      },
    },
    dialogs: {
      removePayment: {
        title: '¿Eliminar abono?',
        message: 'Se sumarán ${{amount}} de vuelta al saldo pendiente.',
      },
      settle: {
        title: '¿Marcar como saldada?',
        pending: 'Aún quedan ${{remaining}} pendientes. Se moverá fuera de tus deudas activas.',
        clear: 'Se moverá fuera de tus deudas activas; su historial se conserva.',
        confirm: 'Saldar',
      },
    },
  },
  en: {
    title: 'Debts',
    newDebt: 'New debt',
    sections: {
      lent: 'Owed to me',
      owed: 'I owe',
    },
    empty: {
      title: 'No active debts',
      subtitle: "Track what you're owed or what you owe",
    },
    form: {
      personPlaceholder: 'With whom? (Ana, Carlos…)',
      submit: 'Save debt',
    },
    source: {
      label: 'Came from',
      pick: 'Source of funds',
      income: 'Income',
      total: 'Total balance',
    },
    overview: {
      title: 'Debt balance',
      meta_one: 'Owed to you $ {{lent}} · You owe $ {{owed}} · {{count}} active',
      meta_other: 'Owed to you $ {{lent}} · You owe $ {{owed}} · {{count}} active',
    },
    card: {
      lent: 'Owes you',
      owed: 'You owe',
      due: ' · due {{date}}',
      ofAmount: 'of ${{amount}}',
    },
    detail: {
      title: 'Debt',
      heroLent: '{{person}} owes you',
      heroOwed: 'You owe {{person}}',
      progress: 'Paid ${{paid}} of ${{amount}}',
      payCta: 'Log payment',
      payShort: 'Pay',
      rows: {
        original: 'Original amount',
        created: 'Created',
        agreed: 'Agreed date',
      },
      payments: {
        title: 'Payments',
        empty: 'No payments yet',
        hint: 'Press and hold a payment to remove it.',
      },
      settle: {
        label: 'Mark as settled',
        caption: 'It will no longer appear in your active debts; its history is kept.',
      },
    },
    dialogs: {
      removePayment: {
        title: 'Remove payment?',
        message: '${{amount}} will be added back to the pending balance.',
      },
      settle: {
        title: 'Mark as settled?',
        pending: '${{remaining}} still pending. It will be moved out of your active debts.',
        clear: 'It will be moved out of your active debts; its history is kept.',
        confirm: 'Settle',
      },
    },
  },
};
