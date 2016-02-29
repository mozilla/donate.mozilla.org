import React from 'react';
import { Route, Redirect } from 'react-router';
import pages from '../data/pages.js';
import locales from '../public/locales.json';

function redirect(state, replace) {
  // This is done so that we can inject the locale in server side rendering
  if (state.location.pathname === '/') {
    replace('/');
  }
}

export default (
  (<Route path="/" onEnter={redirect}>
      {
        Object.keys(locales).map(function(locale) {
          return Object.keys(pages).map(function(key) {
            var routeOBJ = {
              path: `${locale}${key}`,
              component: pages[key].component
            };
            return (
              <Route {...routeOBJ}/>
            );
          });
        })
      }
      {
        Object.keys(locales).map(function(locale) {
          return Object.keys(pages).map(function(key) {
            var routeOBJ = {
              path: `/:locale${key}`,
              component: pages[key].component
            };
            return (
              <Route {...routeOBJ}/>
            );
          });
        })
      }
      <Redirect from="*/*" to="*/*/" />
      <Redirect from="*" to="*/" />
    </Route>
    )
);
