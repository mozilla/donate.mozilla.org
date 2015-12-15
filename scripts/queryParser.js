import currencies from '../data/currencies.js';
import {localeCurrencyData, localeCountryData} from '../data/locale-data.js';
import i18n from '../locales/i18n.js';

function isNumber(item) {
  return !isNaN(parseInt(item, 10));
}

module.exports = function(queryString, pathname) {
  queryString = queryString || {};
  var localesData = i18n.intlDataFor(i18n.urlOverrideLang(pathname).lang);
  var presets = queryString.presets || "";
  var locale = localesData.locales[0];

  var queryStringCurrencyCode = queryString.currency;
  var localeCurrencyCode = localeCurrencyData[locale];
  var country = queryString.country || localeCountryData[locale] || "US";
  var amount = "";
  var frequency = "single";
  var billingAddress = "";
  if (queryString.billingAddress === "full") {
    billingAddress = queryString.billingAddress;
  }
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

  return {
    test: queryString.test,
    billingAddress: billingAddress,
    currency: currency,
    presets: presets,
    amount: amount,
    frequency: frequency,
    messages: localesData.messages,
    locales: localesData.locales,
    email: queryString.email || "",
    country: country
  };
};
