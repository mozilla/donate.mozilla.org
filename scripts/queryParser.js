import currencies from '../data/currencies.js';
import i18n from '../locales/i18n.js';

function isNumber(item) {
  return !isNaN(parseInt(item));
}

module.exports = function(queryString, pathname) {
  var presets = "";
  var currencyCode = "usd";
  var amount = "";
  var frequency = "single";
  var currency = currencies['usd'];

  if (queryString) {
    presets = queryString.presets || presets;
    currencyCode = queryString.currency;
    if(queryString.amount && !isNaN(queryString.amount)) {
      amount = queryString.amount.trim();
    }
    if (queryString.frequency === "monthly") {
      frequency = "monthly";
    }
    if(queryString.currency !== "usd" && currencies[currencyCode]) {
      currency = currencies[currencyCode];
    }
    // We didn't get valid presets from the query string,
    // so default to the currency and frequency preset.
    presets = presets.split(",");
    if (presets.length !== 4 || !presets.every(isNumber)) {
      presets = currency.presets[frequency];
    }
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
