import React from 'react';
import { Route } from 'react-router';
import { paths as currencies } from '../scripts/currencies.js';
import paths from '../scripts/paths.js';
var pathsArray = Object.keys(paths).concat(currencies);

var routes = (
  <Route>
    {
      Object.keys(paths).map(function(key) {
        return (
          <Route key={key} {...paths[key]} />
        );
      })
    }
    <Route name="paypal-donate" path="/paypal-donate-:currency/?" handler={require('../pages/paypal-donate.jsx')} />
  </Route>
);

module.exports = {
  paths: pathsArray,
  routes: routes
};
