var currencies = require('../dist/data/currencies.js');

module.exports = {
  getAccountType: function(amount, currency) {
    var MACRO_FEE_PERCENT = 2.9 / 100;
    var MICRO_FEE_PERCENT = 6 / 100;

    currency = currency.toLowerCase();
    amount = parseInt(amount, 10);

    // Somehow a paypal disabled currency got this far,
    // it's not suppported, so cannot use a micro account.
    if (currencies[currency].disabled === 'paypal') {
      return "macro";
    }
    var fixedFees = currencies[currency].paypalFixedFee;
    var macroFee = amount * MACRO_FEE_PERCENT + fixedFees.macro;
    var microFee = amount * MICRO_FEE_PERCENT + fixedFees.micro;

    if (microFee <= macroFee) {
      return "micro";
    }
    return "macro";
  },
  creds: {
    macro: {
      PAYPAL_USER: process.env.PAYPAL_USER,
      PAYPAL_PWD: process.env.PAYPAL_PWD,
      PAYPAL_SIGNATURE: process.env.PAYPAL_SIGNATURE
    },
    micro: {
      PAYPAL_USER: process.env.PAYPAL_MICRO_USER,
      PAYPAL_PWD: process.env.PAYPAL_MICRO_PWD,
      PAYPAL_SIGNATURE: process.env.PAYPAL_MICRO_SIGNATURE
    }
  }
};
