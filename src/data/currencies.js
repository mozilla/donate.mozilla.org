module.exports = {
  'usd': {
    code: 'usd',
    minAmount: '2',
    symbol: '$',
    paypalFixedFee: {
      macro: 0.30,
      micro: 0.05
    },
    monthlyUpgrade: [
      {min: 250, value: "30"},
      {min: 120, value: "20"},
      {min: 60, value: "15"},
      {min: 35, value: "10"},
      {min: 15, value: "5"}
    ],
    presets: {
      single: ['50', '25', '10', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'aed': {
    code: 'aed',
    minAmount: '8',
    symbol: 'د.إ.‏',
    disabled: "paypal",
    presets: {
      single: ['55', '37', '18', '11'],
      monthly: ['37', '18', '11', '8']
    }
  },
  'all': {
    code: 'all',
    minAmount: '230',
    symbol: 'L',
    disabled: "paypal",
    presets: {
      single: ['2280', '1140', '570', '350'],
      monthly: ['1140', '570', '350', '230']
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
    monthlyUpgrade: [
      {min: 250, value: "30"},
      {min: 150, value: "25"},
      {min: 80, value: "20"},
      {min: 45, value: "12"},
      {min: 20, value: "6"}
    ],
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'ars': {
    code: 'ars',
    minAmount: '30',
    symbol: '$',
    amexDisabled: true,
    disabled: "paypal",
    presets: {
      single: ['300', '150', '75', '45'],
      monthly: ['150', '75', '45', '30']
    }
  },
  'azn': {
    code: 'azn',
    minAmount: '4',
    symbol: '₼',
    disabled: "paypal",
    presets: {
      single: ['34', '17', '8', '5'],
      monthly: ['17', '8', '5', '4']
    }
  },
  'bdt': {
    code: 'bdt',
    minAmount: '162',
    symbol: '৳',
    disabled: "paypal",
    presets: {
      single: ['1600', '800', '400', '240'],
      monthly: ['800', '400', '240', '162']
    }
  },
  'brl': {
    code: 'brl',
    minAmount: '6',
    symbol: 'R$',
    amexDisabled: true,
    paypalFixedFee: {
      macro: 0.60,
      micro: 0.10
    },
    presets: {
      single: ['60', '30', '15', '10'],
      monthly: ['30', '15', '10', '6']
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
    monthlyUpgrade: [
      {min: 250, value: "30"},
      {min: 150, value: "25"},
      {min: 80, value: "20"},
      {min: 45, value: "12"},
      {min: 20, value: "6"}
    ],
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
  'clp': {
    code: 'clp',
    minAmount: '1300',
    symbol: '$',
    disabled: "paypal",
    amexDisabled: true,
    zeroDecimal: "stripe",
    presets: {
      single: ['13000', '6500', '3250', '2000'],
      monthly: ['6500', '3250', '2000', '1300']
    }
  },
  'cny': {
    code: 'cny',
    minAmount: '14',
    symbol: '¥',
    disabled: "paypal",
    presets: {
      single: ['140','70','35','20'],
      monthly: ['70','35','20','14']
    }
  },
  'czk': {
    code: 'czk',
    minAmount: '45',
    amexDisabled: true,
    symbol: 'Kč',
    paypalFixedFee: {
      macro: 10.00,
      micro: 1.67
    },
    presets: {
      single: ['450', '220', '110', '70'],
      monthly: ['220', '110', '70', '45']
    }
  },
  'dkk': {
    code: 'dkk',
    minAmount: '13',
    symbol: 'kr',
    paypalFixedFee: {
      macro: 2.60,
      micro: 0.43
    },
    presets: {
      single: ['130', '60', '30', '20'],
      monthly: ['60', '30', '20', '15']
    }
  },
  'dzd': {
    code: 'dzd',
    minAmount: '220',
    symbol: 'د.ج.‏',
    disabled: "paypal",
    presets: {
      single: ['2180', '1000', '550', '330'],
      monthly: ['1000', '550', '330', '220']
    }
  },
  'egp': {
    code: 'egp',
    minAmount: '34',
    symbol: 'ج.م.‏',
    disabled: "paypal",
    presets: {
      single: ['257', '171', '85', '51'],
      monthly: ['171', '85', '51', '34']
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
    monthlyUpgrade: [
      {min: 250, value: "30"},
      {min: 120, value: "20"},
      {min: 60, value: "15"},
      {min: 35, value: "10"},
      {min: 15, value: "5"}
    ],
    presets: {
      single: ['50', '25', '10', '3'],
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
    monthlyUpgrade: [
      {min: 200, value: "30"},
      {min: 100, value: "20"},
      {min: 50, value: "15"},
      {min: 25, value: "10"},
      {min: 10, value: "4"}
    ],
    presets: {
      single: ['20', '10', '5', '3'],
      monthly: ['10', '5', '3', '2']
    }
  },
  'gel': {
    code: 'gel',
    minAmount: '5',
    symbol: '₾',
    disabled: "paypal",
    presets: {
      single: ['50', '25', '12', '7'],
      monthly: ['25', '12', '7', '5']
    }
  },
  'gtq': {
    code: 'gtq',
    minAmount: '15',
    symbol: 'Q',
    amexDisabled: true,
    disabled: "paypal",
    presets: {
      single: ['145', '70', '35', '20'],
      monthly: ['70', '35', '20', '15']
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
  'hrk': {
    code: 'hrk',
    minAmount: '13',
    symbol: 'kn',
    disabled: "paypal",
    presets: {
      single: ['128', '64', '32', '19'],
      monthly: ['64', '32', '19', '13']
    }
  },
  'huf': {
    code: 'huf',
    minAmount: '490',
    amexDisabled: true,
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
    amexDisabled: true,
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
      single: ['2240', '1120', '560', '340'],
      monthly: ['1120', '560', '340', '240']
    }
  },
  'krw': {
    code: 'krw',
    minAmount: '2240',
    symbol: '₩',
    disabled: "paypal",
    zeroDecimal: "stripe",
    monthlyUpgrade: [
      {min: 280000, value: "33000"},
      {min: 135000, value: "22000"},
      {min: 67000, value: "16000"},
      {min: 40000, value: "10000"},
      {min: 16000, value: "5500"}
    ],
    presets: {
      single: ['22320', '11160', '5580', '3350'],
      monthly: ['11160', '5580', '3350', '2240']
    }
  },
  'lbp': {
    code: 'lbp',
    minAmount: '3016',
    symbol: 'ل.ل.‎',
    disabled: "paypal",
    presets: {
      single: ['22623', '15082', '7541', '4525'],
      monthly: ['15082', '7541', '4525', '3016']
    }
  },
  'mad': {
    code: 'mad',
    minAmount: '20',
    symbol: 'MAD',
    disabled: "paypal",
    presets: {
      single: ['150', '100', '50', '30'],
      monthly: ['100', '50', '30', '20']
    }
  },
  'myr': {
    code: 'myr',
    minAmount: '9',
    symbol: 'RM',
    disabled: "paypal",
    presets: {
      single: ['85', '42', '21', '13'],
      monthly: ['42', '21', '13', '9']
    }
  },
  'mxn': {
    code: 'mxn',
    minAmount: '30',
    symbol: '$',
    amexDisabled: true,
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
  'qar': {
    code: 'qar',
    minAmount: '8',
    symbol: 'ر.ق.‏',
    disabled: "paypal",
    presets: {
      single: ['55', '36', '18', '11'],
      monthly: ['36', '18', '11', '8']
    }
  },
  'ron': {
    code: 'ron',
    minAmount: '8',
    symbol: 'lei',
    disabled: "paypal",
    presets: {
      single: ['80', '40', '20', '12'],
      monthly: ['40', '20', '12', '8']
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
  'sar': {
    code: 'sar',
    minAmount: '8',
    symbol: 'ر.س.‏',
    disabled: "paypal",
    presets: {
      single: ['56', '37', '18', '11'],
      monthly: ['37', '18', '11', '8']
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
  'try': {
    code: 'try',
    minAmount: '7',
    symbol: '₺',
    disabled: "paypal",
    presets: {
      single: ['70', '35', '18', '10'],
      monthly: ['35', '18', '10', '7']
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
  },
  'uah': {
    code: 'uah',
    minAmount: '53',
    symbol: '₴',
    disabled: "paypal",
    presets: {
      single: ['530', '260', '130', '80'],
      monthly: ['260', '130', '80', '53']
    }
  },
  'yer': {
    code: 'yer',
    minAmount: '500',
    symbol: 'ر.ي.‏',
    disabled: "paypal",
    presets: {
      single: ['3752', '2500', '1250', '750'],
      monthly: ['2500', '1250', '750', '500']
    }
  },
  'zar': {
    code: 'zar',
    minAmount: '28',
    symbol: 'R',
    disabled: "paypal",
    presets: {
      single: ['275', '130', '70', '40'],
      monthly: ['130', '70', '40', '28']
    }
  }
};
