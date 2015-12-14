var currencies = require('../data/currencies.js');
module.exports = {
  stripe: Object.keys(currencies),
  paypal: Object.keys(currencies).filter(function(i) {
    if (!currencies[i].hasOwnProperty('disabled')) {
      return i;
    }
  })
};
