import React from 'react';
import { Route } from 'react-router';
import pages from '../data/pages.js';
import locales from '../locales/index.js';

var routes = (
  <Route>
    {
      Object.keys(pages).map(function(key) {
        return (
          <Route key={key} {...pages[key]} />
        );
      })
    }
    {/* route with locale in them */}
    {
      locales.map(function(locale) {
        return Object.keys(pages).map(function(key) {
          var routeOBJ = {
            key: pages[key].name + '-' + locale,
            name:pages[key].name + '-' + locale,
            path:pages[key].path.replace(':locale', locale),
            handler: pages[key].handler
          }
          return (
            <Route {...routeOBJ}/>
          );
        })
      })
    }
  </Route>
);

module.exports = routes;
