var currencies = require('../data/currencies.js');

function suggestMonthly(amount, currency) {
  var upgradeRanges = currencies[currency].monthlyUpgrade || [];
  var upgradeResult = "";
  amount = parseInt(amount, 10);

  for (let i = 0; i < upgradeRanges.length && !upgradeResult; i++) {
    if (amount >= upgradeRanges[i].min) {
      upgradeResult = upgradeRanges[i].value;
    }
  }

  return upgradeResult;
}

module.exports = suggestMonthly;

