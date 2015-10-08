import currencies from '../data/currencies.js';
import i18n from '../locales/i18n.js';

module.exports = function(queryString) {
  var presets = "";
  var currencyCode = "usd";
  var amount = "";
  var frequency = "single";
  if (queryString) {
    presets = queryString.presets || presets;
    currencyCode = queryString.currency || currencyCode;
    amount = queryString.amount || amount;
    if (queryString.frequency === "monthly") {
      frequency = "monthly";
    }
  }

  var currency = currencies[currencyCode];
  if (!currency) {
    currency = currencies['usd'];
  }
  function isNumber(item) {
    return !isNaN(item);
  }
  // We didn't get valid presets from the query string,
  // so default to the currency and frequency preset.
  presets = presets.split(",");
  if (presets.length !== 4 || !presets.every(isNumber)) {
    presets = currency.presets[frequency];
  }
  var localesData = i18n.intlDataFor(i18n.urlOverrideLang().lang);
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
