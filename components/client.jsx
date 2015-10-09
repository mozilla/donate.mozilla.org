import React from 'react';
import Router from 'react-router';
import routes from './routes.jsx';
import langURLParser from '../scripts/langURLParser.js';
import queryParser from '../scripts/queryParser.js';

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var queryString = state.query;
  var pathname = langURLParser(state);
  if(pathname) {
    if(queryString) {
      delete queryString.redirect;
    }
    return Handler.replaceWith(pathname, {}, queryString);
  }
  React.render(<Handler {...queryParser(queryString, state.pathname)} />, document.querySelector("#my-app"));
});
