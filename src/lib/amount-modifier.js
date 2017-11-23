var currencies = require('../data/currencies.js');

function convertToCents(amount) {
  amount = amount || "0";
  if (typeof amount !== 'string') {
    amount += "";
  }
  var splitAmount = amount.split(".");
  var dollar = splitAmount[0];
  var cents = splitAmount[1] || "0";
  return (parseInt(dollar, 10) * 100) + parseInt(cents, 10);
}

function convertFromCents(amount) {
  amount = amount || "0";
  return (parseInt(amount, 10)/100);
}

var amountModifier = {
  modify: function(amount, service, currencyCode) {
    if (!amount) {
      return "0";
    }
    var currency = currencies[currencyCode];
    var zeroDecimal = currency.zeroDecimal || "";
    // These currencies don't use cents
    if (zeroDecimal.indexOf(service) > -1) {
      return parseInt(amount, 10) + "";
    }
    // stripe works in lowest currency unit, in most cases cents.
    if (service === "stripe") {
      return convertToCents(amount) + "";
    }
    return amount + "";
  },
  reverse: function(amount, service, currencyCode) {
    if (!amount) {
      return "0";
    }
    var currency = currencies[currencyCode];
    var zeroDecimal = currency.zeroDecimal || "";
    // These currencies don't use cents
    if (zeroDecimal.indexOf(service) > -1) {
      return parseInt(amount, 10) + "";
    }
    // stripe works in lowest currency unit, in most cases cents.
    if (service === "stripe") {
      return convertFromCents(amount) + "";
    }
    return amount + "";
  },
  stripe: function(amount, currencyCode) {
    return this.modify(amount, "stripe", currencyCode);
  },
  stripeReverse: function(amount, currencyCode) {
    return this.reverse(amount, "stripe", currencyCode);
  },
  // paypal doesn't accept cents in some currencies.
  paypal: function(amount, currencyCode) {
    return this.modify(amount, "paypal", currencyCode);
  },
  paypalReverse: function(amount, currencyCode) {
    return this.reverse(amount, "paypal", currencyCode);
  }
};

module.exports = amountModifier;

