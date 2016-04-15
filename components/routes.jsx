/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-disable no-unused-vars*/

import { Route } from 'react-router';
import pages from '../data/pages.js';
import locales from '../public/locales.json';

var routes = (
  <Route>
    <Route path="/"/>
    {
      Object.keys(locales).map(function(locale) {
        return Object.keys(pages).map(function(key) {
          var routeOBJ = {
            key: key,
            path: `${locale}${key}`,
            component: pages[key]
          };
          return (
            <Route {...routeOBJ}/>
          );
        });
      })
    }
  </Route>
);

module.exports = routes;
