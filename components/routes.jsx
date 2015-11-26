/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-disable no-unused-vars*/

import { Route } from 'react-router';
import pages from '../data/paths.js';

var routes = (
  <Route>
    {
      Object.keys(pages).map(function(page, key) {
        var routeOBJ = {
          key:  key,
          path: pages[page].pathname,
          handler: require('../pages/' + pages[page].filename)
        };
        return (
          <Route {...routeOBJ}/>
        );
      })
    }
  </Route>
);

module.exports = routes;
