import React from 'react';
import Router from 'react-router';
import currencies from '../data/currencies.js';
import routes from './routes.jsx';
import langURLParser from '../scripts/langURLParser.js';
import i18n from '../locales/i18n.js';

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var queryString = state.query;

  var presets = "";
  var currencyCode = "usd";
  var amount = "";
  var frequency = "single";
  if (queryString) {
    presets = queryString.presets || presets;
    currencyCode = queryString.currency || currencyCode;
    if(queryString.amount && !isNaN(queryString.amount)) {
      amount = queryString.amount.trim();
    }
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

  var pathname = langURLParser(state);
  if(pathname) {
    if(queryString) {
      delete queryString.redirect;
    }
    return Handler.replaceWith(pathname, {}, state.query);
  }
  var localesData = i18n.intlDataFor(i18n.urlOverrideLang().lang);
  var values = {
    currency: currency,
    presets: presets,
    currencies: currencies,
    amount: amount,
    frequency: frequency,
    messages: localesData.messages,
    locales: localesData.locales
  };

  React.render(<Handler {...values} />, document.querySelector("#my-app"));
});
