const currencies = require('../../dist/data/currencies.js');
const currencyFor = {
  stripe: Object.keys(currencies),
  paypal: Object.keys(currencies).filter(c => currencies[c].disabled !== 'paypal')
};

module.exports = currencyFor;
