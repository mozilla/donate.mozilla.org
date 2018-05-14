/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-disable no-unused-vars*/

import { Route, IndexRoute, Redirect } from 'react-router';
import locales from '../public/locales.json';

var routes = (
  <Route path="/">
    {
      Object.keys(locales).map(function(locale) {
        return (
          <Route key={locale} path={locale}>
            <IndexRoute component={require('./pages/about.js')}/>
            <Route path='about' component={require('./pages/about.js')}/>
            <Route path='one-page' component={require('./pages/one-page.js')}/>
            <Route path='thank-you' component={require('./pages/thank-you.js')}/>
            <Route path='share' component={require('./pages/share.js')}/>
            <Route path='ways-to-give' component={require('./pages/ways-to-give.js')}/>
            <Route path='faq' component={require('./pages/faq.js')}/>
            <Route path='give-bitcoin' component={require('./pages/give-bitcoin.js')}/>
            <Route path="thunderbird">
              <IndexRoute component={require('./pages/thunderbird/about.js')}/>
              <Route path='about' component={require('./pages/thunderbird/about.js')}/>
              <Route path='one-page' component={require('./pages/thunderbird/one-page.js')}/>
              <Route path='thank-you' component={require('./pages/thunderbird/thank-you.js')}/>
              <Route path='share' component={require('./pages/thunderbird/share.js')}/>
              <Route path='faq' component={require('./pages/thunderbird/faq.js')}/>
              <Redirect from="*" to={"/" + locale + "/thunderbird"} />
            </Route>
            <Redirect from="*" to={"/" + locale} />
            <Redirect from="/glassroomnyc" to="/" /> /* optional */
          </Route>
        );
      })
    }
    <Redirect from="*" to="/" />
  </Route>
);

module.exports = routes;
