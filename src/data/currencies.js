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
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'brl': {
    code: 'brl',
    minAmount: '5',
    symbol: 'R$',
    presets: {
      single: ['40', '24', '12', '8'],
      monthly: ['20', '15', '10', '6']
    }
  },
  'cad': {
    code: 'cad',
    minAmount: '2',
    symbol: '$',
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'chf': {
    code: 'chf',
    minAmount: '2',
    symbol: 'CHF',
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'cny': {
    code: 'cny',
    minAmount: '12',
    symbol: '¥',
    disabled: "paypal",
    presets: {
      single: ['120','60','30','15'],
      monthly: ['60','30','20','12']
    }
  },
  'czk': {
    code: 'czk',
    minAmount: '45',
    symbol: 'Kč',
    presets: {
      single: ['400', '200', '100', '55'],
      monthly: ['300', '150', '80', '45']
    }
  },
  'dkk': {
    code: 'dkk',
    minAmount: '12',
    symbol: 'kr',
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '60', '30', '15']
    }
  },
  'eur': {
    code: 'eur',
    minAmount: '2',
    symbol: '€',
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'gbp': {
    code: 'gbp',
    minAmount: '1',
    symbol: '£',
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'hkd': {
    code: 'hkd',
    minAmount: '15',
    symbol: '$',
    presets: {
      single: ['100', '50', '25', '18'],
      monthly: ['70', '30', '20', '15']
    }
  },
  'huf': {
    code: 'huf',
    minAmount: '490',
    symbol: 'Ft',
    zeroDecimal: "paypal",
    presets: {
      single: ['4000', '2000', '1000', '600'],
      monthly: ['1500', '1000', '800', '500']
    }
  },
  'idr': {
    code: 'idr',
    minAmount: '27000',
    symbol: 'Rp',
    disabled: "paypal",
    presets: {
      single: ['270000', '140000', '70000', '40000'],
      monthly: ['140000', '70000', '40000', '27000']
    }
  },
  'ils': {
    code: 'ils',
    minAmount: '8',
    symbol: '₪',
    presets: {
      single: ['60', '30', '15', '9'],
      monthly: ['50', '20', '10', '8']
    }
  },
  'inr': {
    code: 'inr',
    minAmount: '130',
    symbol: '₹',
    disabled: "paypal",
    presets: {
      single: ['1000', '500', '250', '150'],
      monthly: ['650', '330', '200', '130']
    }
  },
  'jpy': {
    code: 'jpy',
    minAmount: '240',
    symbol: '¥',
    zeroDecimal: "stripe paypal",
    presets: {
      single: ['1600', '800', '400', '250'],
      monthly: ['1000', '600', '300', '240']
    }
  },
  'mxn': {
    code: 'mxn',
    minAmount: '30',
    symbol: '$',
    presets: {
      single: ['240', '120', '60', '35'],
      monthly: ['200', '100', '40', '30']
    }
  },
  'nok': {
    code: 'nok',
    minAmount: '15',
    symbol: 'kr',
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '60', '30', '15']
    }
  },
  'nzd': {
    code: 'nzd',
    minAmount: '3',
    symbol: '$',
    presets: {
      single: ['40', '20', '10', '4'],
      monthly: ['20', '10', '8', '3']
    }
  },
  'php': {
    code: 'php',
    minAmount: '90',
    symbol: '₱',
    presets: {
      single: ['600', '300', '150', '100'],
      monthly: ['300', '200', '120', '90']
    }
  },
  'pln': {
    code: 'pln',
    minAmount: '7',
    symbol: 'zł',
    presets: {
      single: ['80', '40', '20', '10'],
      monthly: ['40', '20', '10', '7']
    }
  },
  'rub': {
    code: 'rub',
    minAmount: '100',
    symbol: '₽',
    presets: {
      single: ['1000', '500', '250', '140'],
      monthly: ['250', '180', '120', '100']
    }
  },
  'sek': {
    code: 'sek',
    minAmount: '15',
    symbol: 'kr',
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '40', '20', '15']
    }
  },
  'thb': {
    code: 'thb',
    minAmount: '70',
    symbol: '฿',
    presets: {
      single: ['500', '250', '125', '75'],
      monthly: ['300', '200', '100', '70']
    }
  },
  'twd': {
    code: 'twd',
    minAmount: '62',
    symbol: 'NT$',
    zeroDecimal: "paypal",
    presets: {
      single: ['480', '240', '150', '70'],
      monthly: ['250', '150', '100', '62']
    }
  }
};
