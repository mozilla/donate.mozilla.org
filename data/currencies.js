module.exports = {
  'usd': {
    code: 'usd',
    minAmount: '2',
    symbol: '$',
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'aud': {
    code: 'aud',
    minAmount: '2',
    symbol: '$',
    presets: {
      single: ['200', '150', '100', '50'],
      monthly: ['50', '40', '30', '20']
    }
  },
  'brl': {
    code: 'brl',
    minAmount: '5',
    symbol: 'R$',
    presets: {
      single: ['250', '150', '100', '25'],
      monthly: ['90', '75', '50', '25']
    }
  },
  'cad': {
    code: 'cad',
    minAmount: '2',
    symbol: '$',
    presets: {
      single: ['250', '100', '50', '25'],
      monthly: ['50', '40', '30', '20']
    }
  },
  'chf': {
    code: 'chf',
    minAmount: '2',
    symbol: 'CHF',
    presets: {
      single: ['200', '120', '60', '20'],
      monthly: ['10', '8', '6', '4']
    }
  },
  'czk': {
    code: 'czk',
    minAmount: '45',
    symbol: 'Kč',
    presets: {
      single: ['1500', '1000', '500', '190'],
      monthly: ['570', '415', '365', '220']
    }
  },
  'dkk': {
    code: 'dkk',
    minAmount: '12',
    symbol: 'kr',
    presets: {
      single: ['1000', '500', '250', '150'],
      monthly: ['150', '100', '75', '50']
    }
  },
  'eur': {
    code: 'eur',
    minAmount: '2',
    symbol: '€',
    presets: {
      single: ['100', '50', '25', '5'],
      monthly: ['25', '15', '10', '5']
    }
  },
  'gbp': {
    code: 'gbp',
    minAmount: '1',
    symbol: '£',
    presets: {
      single: ['25', '15', '10', '5'],
      monthly: ['10', '7', '5', '3']
    }
  },
  'hkd': {
    code: 'hkd',
    minAmount: '15',
    symbol: '$',
    presets: {
      single: ['2000', '100', '500', '250'],
      monthly: ['500', '300', '150', '75']
    }
  },
  'huf': {
    code: 'huf',
    minAmount: '490',
    symbol: 'Ft',
    zeroDecimal: "paypal",
    presets: {
      single: ['5000', '3500', '2000', '1000'],
      monthly: ['2000', '1500', '1350', '1000']
    }
  },
  'ils': {
    code: 'ils',
    minAmount: '8',
    symbol: '₪',
    presets: {
      single: ['500', '360', '180', '120'],
      monthly: ['75', '40', '25', '15']
    }
  },
  'inr': {
    code: 'inr',
    minAmount: '130',
    symbol: '₹',
    disabled: "paypal",
    presets: {
      single: ['1300', '650', '330', '200'],
      monthly: ['650', '330', '200', '130']
    }
  },
  'jpy': {
    code: 'jpy',
    minAmount: '240',
    symbol: '¥',
    zeroDecimal: "stripe paypal",
    presets: {
      single: ['10000', '5000', '2500', '1000'],
      monthly: ['5000', '2500', '1000', '500']
    }
  },
  'mxn': {
    code: 'mxn',
    minAmount: '30',
    symbol: '$',
    presets: {
      single: ['1000', '700', '500', '250'],
      monthly: ['350', '200', '150', '90']
    }
  },
  'nok': {
    code: 'nok',
    minAmount: '15',
    symbol: 'kr',
    presets: {
      single: ['1500', '1000', '500', '250'],
      monthly: ['400', '300', '250', '200']
    }
  },
  'nzd': {
    code: 'nzd',
    minAmount: '3',
    symbol: '$',
    presets: {
      single: ['150', '80', '50', '25'],
      monthly: ['45', '40', '35', '30']
    }
  },
  'php': {
    code: 'php',
    minAmount: '90',
    symbol: '₱',
    presets: {
      single: ['5000', '3000', '2000', '1000'],
      monthly: ['2000', '1000', '750', '500']
    }
  },
  'pln': {
    code: 'pln',
    minAmount: '7',
    symbol: 'zł',
    presets: {
      single: ['250', '100', '60', '40'],
      monthly: ['90', '60', '45', '30']
    }
  },
  'rub': {
    code: 'rub',
    minAmount: '100',
    symbol: 'руб',
    presets: {
      single: ['1000', '500', '250', '150'],
      monthly: ['250', '180', '120', '75']
    }
  },
  'sek': {
    code: 'sek',
    minAmount: '15',
    symbol: 'kr',
    presets: {
      single: ['1000', '500', '200', '100'],
      monthly: ['250', '200', '150', '100']
    }
  },
  'thb': {
    code: 'thb',
    minAmount: '70',
    symbol: '฿',
    presets: {
      single: ['3000', '2000', '1000', '500'],
      monthly: ['600', '500', '400', '300']
    }
  },
  'twd': {
    code: 'twd',
    minAmount: '62',
    symbol: 'NT$',
    zeroDecimal: "paypal",
    presets: {
      single: ['1000', '500', '250', '100'],
      monthly: ['250', '150', '100', '50']
    }
  }
};
