var should = require('should');
var accountSwitcher = require("../../server/lib/paypal-account-switcher.js");

function runTest(amount, currency, expected) {
  it(amount + " " + currency + " should be " + expected, function() {
    should.equal(accountSwitcher.getAccountType(amount, currency), expected);
  });
}

var testData = {
  GBP: {'5': 'macro', '10': 'macro', '50': 'macro', '100.50': 'macro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  USD: {'5': 'micro', '10': 'macro', '50': 'macro', '100.50': 'macro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  EUR: {'5': 'micro', '10': 'macro', '50': 'macro', '100.50': 'macro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  CHF: {'5': 'micro', '10': 'micro', '50': 'macro', '100.50': 'macro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  SEK: {'5': 'micro', '10': 'micro', '50': 'micro', '100.50': 'macro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  MXN: {'5': 'micro', '10': 'micro', '50': 'micro', '100.50': 'micro', '200': 'macro', '1000': 'macro', '2000': 'macro'},
  TWD: {'5': 'micro', '10': 'micro', '50': 'micro', '100.50': 'micro', '200': 'micro', '1000': 'macro', '2000': 'macro'},
  JPY: {'5': 'micro', '10': 'micro', '50': 'micro', '100.50': 'micro', '200': 'micro', '1000': 'micro', '2000': 'macro'},
  HUF: {'5': 'micro', '10': 'micro', '50': 'micro', '100.50': 'micro', '200': 'micro', '1000': 'micro', '2000': 'micro'}
};

describe("paypal-micro.js", function() {
  describe("getAccountType", function() {
    Object.keys(testData).forEach(function(currency) {
      Object.keys(testData[currency]).forEach(function(amount) {
        runTest(amount, currency, testData[currency][amount]);
      });
    });
  });
});
