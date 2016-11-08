module.exports = {
  'usd': {
    code: 'usd',
    minAmount: '2',
    symbol: '$',
    paypalFixedFee: {
      macro: 0.30,
      micro: 0.05
    },
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'aud': {
    code: 'aud',
    minAmount: '2',
    symbol: '$',
    paypalFixedFee: {
      macro: 0.30,
      micro: 0.05
    },
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'brl': {
    code: 'brl',
    minAmount: '5',
    symbol: 'R$',
    paypalFixedFee: {
      macro: 0.60,
      micro: 0.10
    },
    presets: {
      single: ['40', '24', '12', '8'],
      monthly: ['20', '15', '10', '6']
    }
  },
  'cad': {
    code: 'cad',
    minAmount: '2',
    symbol: '$',
    paypalFixedFee: {
      macro: 0.30,
      micro: 0.05
    },
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'chf': {
    code: 'chf',
    minAmount: '2',
    symbol: 'CHF',
    paypalFixedFee: {
      macro: 0.55,
      micro: 0.09
    },
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
    paypalFixedFee: {
      macro: 10.00,
      micro: 1.67
    },
    presets: {
      single: ['400', '200', '100', '55'],
      monthly: ['300', '150', '80', '45']
    }
  },
  'dkk': {
    code: 'dkk',
    minAmount: '12',
    symbol: 'kr',
    paypalFixedFee: {
      macro: 2.60,
      micro: 0.43
    },
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '60', '30', '15']
    }
  },
  'eur': {
    code: 'eur',
    minAmount: '2',
    symbol: '€',
    paypalFixedFee: {
      macro: 0.35,
      micro: 0.05
    },
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'gbp': {
    code: 'gbp',
    minAmount: '1',
    symbol: '£',
    paypalFixedFee: {
      macro: 0.20,
      micro: 0.05
    },
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'hkd': {
    code: 'hkd',
    minAmount: '15',
    symbol: '$',
    paypalFixedFee: {
      macro: 2.35,
      micro: 0.39
    },
    presets: {
      single: ['100', '50', '25', '18'],
      monthly: ['70', '30', '20', '15']
    }
  },
  'huf': {
    code: 'huf',
    minAmount: '490',
    symbol: 'Ft',
    paypalFixedFee: {
      macro: 90,
      micro: 15
    },
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
    paypalFixedFee: {
      macro: 1.20,
      micro: 0.20
    },
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
    paypalFixedFee: {
      macro: 40,
      micro: 7
    },
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
    paypalFixedFee: {
      macro: 4.00,
      micro: 0.55
    },
    presets: {
      single: ['240', '120', '60', '35'],
      monthly: ['200', '100', '40', '30']
    }
  },
  'nok': {
    code: 'nok',
    minAmount: '15',
    symbol: 'kr',
    paypalFixedFee: {
      macro: 2.80,
      micro: 0.47
    },
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '60', '30', '15']
    }
  },
  'nzd': {
    code: 'nzd',
    minAmount: '3',
    symbol: '$',
    paypalFixedFee: {
      macro: 0.45,
      micro: 0.08
    },
    presets: {
      single: ['40', '20', '10', '4'],
      monthly: ['20', '10', '8', '3']
    }
  },
  'php': {
    code: 'php',
    minAmount: '90',
    symbol: '₱',
    paypalFixedFee: {
      macro: 15.00,
      micro: 2.50
    },
    presets: {
      single: ['600', '300', '150', '100'],
      monthly: ['300', '200', '120', '90']
    }
  },
  'pln': {
    code: 'pln',
    minAmount: '7',
    symbol: 'zł',
    paypalFixedFee: {
      macro: 1.35,
      micro: 0.23
    },
    presets: {
      single: ['80', '40', '20', '10'],
      monthly: ['40', '20', '10', '7']
    }
  },
  'rub': {
    code: 'rub',
    minAmount: '100',
    symbol: '₽',
    paypalFixedFee: {
      macro: 10,
      micro: 2
    },
    presets: {
      single: ['1000', '500', '250', '140'],
      monthly: ['250', '180', '120', '100']
    }
  },
  'sek': {
    code: 'sek',
    minAmount: '15',
    symbol: 'kr',
    paypalFixedFee: {
      macro: 3.25,
      micro: 0.54
    },
    presets: {
      single: ['160', '80', '40', '20'],
      monthly: ['100', '40', '20', '15']
    }
  },
  'thb': {
    code: 'thb',
    minAmount: '70',
    symbol: '฿',
    paypalFixedFee: {
      macro: 11.00,
      micro: 1.80
    },
    presets: {
      single: ['500', '250', '125', '75'],
      monthly: ['300', '200', '100', '70']
    }
  },
  'twd': {
    code: 'twd',
    minAmount: '62',
    symbol: 'NT$',
    paypalFixedFee: {
      macro: 10.00,
      micro: 2.00
    },
    zeroDecimal: "paypal",
    presets: {
      single: ['480', '240', '150', '70'],
      monthly: ['250', '150', '100', '62']
    }
  }
};
