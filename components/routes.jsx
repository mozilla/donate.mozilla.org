import React from 'react';
import { Route } from 'react-router';
import pages from '../scripts/pages.js';

var routes = (
  <Route>
    {
      Object.keys(pages).map(function(key) {
        return (
          <Route key={key} {...pages[key]} />
        );
      })
    }
    <Route name="paypal-donate" path="/paypal-donate-:currency/?" handler={require('../pages/paypal-donate.jsx')} />
    <Route name="donate-locale" path="/donate-:locale/?" handler={require('../pages/sequential.jsx')} />
    <Route name="thank-you-locale" path="/thank-you-:locale/?" handler={require('../pages/thank-you.jsx')} />
  </Route>
);

module.exports = routes;
