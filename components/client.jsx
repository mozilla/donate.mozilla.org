import React from 'react';
import Router from 'react-router';
import routes from './routes.jsx';
import queryParser from '../scripts/queryParser.js';

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  var queryString = state.query;

  React.render(<Handler {...queryParser(queryString, state.pathname)} />, document.querySelector("#my-app"));
});
