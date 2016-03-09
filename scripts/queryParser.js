import url from 'url';
import currencies from '../data/currencies.js';
import {localeCurrencyData, localeCountryData} from '../data/locale-data.js';
import locales from '../public/locales.json';

function isNumber(item) {
  return !isNaN(parseInt(item, 10));
}

module.exports = function(queryString, pathname) {
  var locale = url.parse(pathname).pathname.split('/')[1] || "en-US";
  queryString = queryString || {};
  var presets = queryString.presets || "";
  var queryStringCurrencyCode = queryString.currency;
  var localeCurrencyCode = localeCurrencyData[locale];
  var country = queryString.country || localeCountryData[locale] || "US";
  var amount = "";
  var frequency = "single";
  var currency = currencies[queryStringCurrencyCode] || currencies[localeCurrencyCode] || currencies.usd;
  var currentString, messages;

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

  if (locale && locales[locale]) {
    currentString = locales[locale];
    messages = Object.assign({}, locales['en-US'], currentString);
  } else {
    locale = 'en-US';
    messages = locales['en-US'];
  }

  return {
    messages,
    locale,
    test: queryString.test,
    currency: currency,
    presets: presets,
    amount: amount,
    frequency: frequency,
    email: queryString.email || "",
    country: country
  };
};
