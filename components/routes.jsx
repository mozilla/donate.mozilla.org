import React from 'react';
import { Route } from 'react-router';
import { paths as currencies } from '../scripts/currencies.js';
import paths from '../scripts/paths.js';
import { paths as localePaths, locales } from "../locales";

var pathsArray = Object.keys(paths).concat(currencies, localePaths);

locales.forEach(function(l) {
  pathsArray.push("/thank-you-" + l);
});

var routes = (
  <Route>
    <Route name="sequential-locale" path="/sequential-:locale/?" handler={require('../pages/sequential.jsx')} />
    <Route name="thank-you-locale" path="/thank-you-:locale/?" handler={require('../pages/thank-you.jsx')} />
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
