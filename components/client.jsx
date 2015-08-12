import React from 'react';
import Router from 'react-router';
import currencies from '../data/currencies.js';
import routes from './routes.jsx';
import {intlData} from '../locales/i18n.js';
var intlDataFor = require('../locales/i18n.js').intlDataFor;
var assign = require('react/lib/Object.assign');

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var values = {};
  if(state.params.currency) {
    values = currencies[state.params.currency];
  }

  if(state.params.locale) {
    var messages = intlDataFor(state.params.locale);
    values = assign(values, messages);
  } else {
    values = assign(values, intlData);
  }
  React.render(<Handler {...values} />, document.querySelector("#my-app"));
});
