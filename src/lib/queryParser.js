import currencies from '../data/currencies.js';
import localeCurrencyData from '../data/locale-data.js';

function isNumber(item) {
  return !isNaN(parseInt(item, 10));
}

module.exports = function(queryString, locale) {
  console.log('query-parser', queryString);

  queryString = queryString || {};
  var presets = queryString.presets || "";
  var queryStringCurrencyCode = queryString.currency;
  var localeCurrencyCode = localeCurrencyData[locale];
  var amount = "";
  var frequency = "single";
  var nextmonth = false;
  var test = queryString.test;
  var currency = currencies[queryStringCurrencyCode] || currencies[localeCurrencyCode] || currencies.usd;

  if (queryString.amount && !isNaN(queryString.amount)) {
    amount = queryString.amount.trim();
  }
  if (queryString.frequency === "monthly") {
    frequency = "monthly";
  }
  if (queryString.nextmonth && !isNaN(queryString.nextmonth)) {
    nextmonth = true;
    console.log('x');
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

  var values = { test, email: queryString.email || "" };

  var initialState = {
    currency,
    presets,
    amount,
    frequency,
    nextmonth
  };

  return { values, initialState };
};
