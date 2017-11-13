var currencies = require('../data/currencies.js');

function suggestMonthly(amount, currency) {
  var upsellRanges = currencies[currency].monthlyUpsell || [];
  var upsellResult = "";
  amount = parseInt(amount, 10);

  for(var i = 0; i < upsellRanges.length && !upsellResult; i++) {
    if (amount >= upsellRanges[i].min) {
      upsellResult = upsellRanges[i].value;
    }
  }

  return upsellResult;
}

module.exports = suggestMonthly;

