import React from 'react';
import Route from 'react-router';
import { currencies } from '../scripts/currencies.js';

import { routes } from './routes.jsx';

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler {...currencies[state.params.currency]}/>, document.querySelector("#my-app"));
});
