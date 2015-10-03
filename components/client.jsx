import React from 'react';
import Router from 'react-router';
import currencies from '../data/currencies.js';
import routes from './routes.jsx';
import i18n from '../locales/i18n.js';
import assign from 'react/lib/Object.assign';
import paths from '../scripts/paths.js';

function redirectTo(pathname, query, Handler) {
  // we need to check if the requested path exists in our paths list
  // if not redirect to root which is better than showing blank page
  if(paths.indexOf(pathname) === -1) {
    Handler.replaceWith('/');
  } else {
    Handler.replaceWith(pathname, {}, query);
  }
}

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var lang = i18n.isSupportedLanguage(i18n.currentLanguage) ? i18n.currentLanguage : i18n.defaultLang;
  var queryString = state.query;
  var pathname = queryString.pathname || state.pathname;

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

  var values = {
    currency: currency,
    presets: presets,
    currencies: currencies,
    amount: amount,
    frequency: frequency
  };

  // checking if language code is part of the URL e.g. /en-US/thank-you
  if(i18n.urlOverrideLang(queryString.pathname).test) {
    // but is the language code supported in our app?
    if(i18n.isSupportedLanguage(i18n.urlOverrideLang().lang)) {
      var messages = i18n.intlDataFor(i18n.urlOverrideLang().lang);
      values = assign(values, messages);
    } else {
      pathname = pathname.split('/')[2] ? pathname.split('/')[2] : '';
      return redirectTo(pathname, queryString, Handler);
    }
    // if not we will hijack the URL and insert the language code in the URL
  } else if(!i18n.urlOverrideLang(queryString.pathname).test) {
    return redirectTo("/" + lang + pathname, queryString, Handler);
  }
  React.render(<Handler {...values} />, document.querySelector("#my-app"));
});
