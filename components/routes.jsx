/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-disable no-unused-vars*/

import { Route } from 'react-router';
import pages from '../data/pages.js';
import locales from '../locales/index.js';

var routes = (
  <Route>
    {
      locales.map(function(locale) {
        return Object.keys(pages).map(function(key) {
          var routeOBJ = {
            key:  pages[key].name + '-' + locale,
            name: pages[key].name + '-' + locale,
            path: pages[key].path.replace(':locale', locale),
            handler: pages[key].handler
          };
          return (
            <Route {...routeOBJ}/>
          );
        });
      })
    }
    {
      Object.keys(pages).map(function(key, i) {
        var routeOBJ = {
          key:  pages[key].name,
          name: pages[key].name,
          path: Object.keys(pages)[i],
          handler: pages[key].handler
        };
        return (
          <Route {...routeOBJ} />
        );
      })
    }
  </Route>
);

module.exports = routes;
