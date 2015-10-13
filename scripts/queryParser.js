import currencies from '../data/currencies.js';
import i18n from '../locales/i18n.js';

function isNumber (item) {
  return !isNaN(parseInt(item));
}

module.exports = function (queryString, pathname) {
  queryString = queryString || {};
  var presets = queryString.presets || "";
  var currencyCode = queryString.currency || "usd";
  var amount = "";
  var frequency = "single";
  var currency = currencies[currencyCode] || currencies['usd'];

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

  var localesData = i18n.intlDataFor(i18n.urlOverrideLang(pathname).lang);
  return {
    currency: currency,
    presets: presets,
    currencies: currencies,
    amount: amount,
    frequency: frequency,
    messages: localesData.messages,
    locales: localesData.locales
  };
};
