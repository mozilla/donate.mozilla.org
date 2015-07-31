import React from 'react';
import assign from 'react/lib/Object.assign';
import Router from 'react-router';
import currencies from '../scripts/currencies.js';
import routes from './routes.jsx';
import {intlDataFor, intlData} from '../scripts/i18n';

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var values = {};
  if(state.params.currency) {
    values = currencies[state.params.currency];
  }

  if(state.params.locale) {
    values = assign(values, intlDataFor(state.params.locale));
  } else {
    values = assign(values, intlData);
  }
  React.render(<Handler {...values} />, document.querySelector("#my-app"));
});
