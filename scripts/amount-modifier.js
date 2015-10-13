var currencies = require('../data/currencies.js');

var amountModifier = {
  modify: function (amount, service, currencyCode) {
    if (!amount) {
      return "0";
    }
    var amt = parseFloat(amount, 10);
    var currency = currencies[currencyCode];
    var zeroDecimal = currency.zeroDecimal || "";
    if (zeroDecimal.indexOf(service) > -1) {
      return Math.trunc(amt) + "";
    }
    // stripe works in lowest currency unit, in most cases cents.
    if (service === "stripe") {
      return amt * 100 + "";
    }
    return amount + "";
  },
  stripe: function (amount, currencyCode) {
    return this.modify(amount, "stripe", currencyCode);
  },
  // paypal doesn't accept cents in some currencies.
  paypal: function (amount, currencyCode) {
    return this.modify(amount, "paypal", currencyCode);
  }
};

module.exports = amountModifier;
