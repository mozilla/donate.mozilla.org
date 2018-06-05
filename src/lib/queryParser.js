import currencies from '../data/currencies.js';
import localeCurrencyData from '../data/locale-data.js';

function isNumber(item) {
  return !isNaN(parseInt(item, 10));
}

module.exports = function(queryString, locale) {
  queryString = queryString || {};
  var presets = queryString.presets || "";
  var queryStringCurrencyCode = queryString.currency;
  var localeCurrencyCode = localeCurrencyData[locale];
  var amount = "";
  var frequency = "single";
  var test = queryString.test;
  var currency = currencies[queryStringCurrencyCode] || currencies[localeCurrencyCode] || currencies.usd;

  if (queryString.amount && !isNaN(queryString.amount)) {
    amount = queryString.amount.trim();
  }
  if (queryString.frequency === "monthly") {
    frequency = "monthly";
  }

  // We didn't get valid presets from the query string,
  // so default to the currency and frequency preset.
  presets = presets.split(",");
  if (presets.length !== 4 || !presets.every(isNumber)) {
    presets = currency.presets[frequency];
  }

  if (test && toString.call(test) === "[object Array]") {
    test = test.join(" ");
  }

  return {
    values: {
      test: test,
      subscribed: queryString.subscribed
    },
    initialState: {
      currency: currency,
      presets: presets,
      amount: amount,
      frequency: frequency,
      email: queryString.email || ""
    }
  };
};
