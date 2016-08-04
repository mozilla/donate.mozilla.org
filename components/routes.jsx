/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-disable no-unused-vars*/

import { Route, IndexRoute } from 'react-router';
import pages from '../data/pages.js';
import locales from '../public/locales.json';

function buildPagesFromData(data) {
  return Object.keys(data).map(function(pageKey) {
    if (pageKey === "/") {
      return (<IndexRoute key={pageKey} component={data[pageKey]}/>);
    }
    return (<Route key={pageKey} path={pageKey.slice(1, -1)} component={data[pageKey]}/>);
  });
}

var routes = (
  <Route path="/">
  {
    Object.keys(locales).map(function(locale) {
      return (
        <Route key={locale} path={locale}>
          {buildPagesFromData(pages)}
        </Route>
      );
    })
  }
  </Route>
);

module.exports = routes;
