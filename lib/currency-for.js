var currencies = require('../dist/data/currencies.js');
var currencyFor = {
  stripe: Object.keys(currencies),
  paypal: Object.keys(currencies).filter(function(i) {
    return currencies[i].disabled !== 'paypal';
  })
};

module.exports = currencyFor;
