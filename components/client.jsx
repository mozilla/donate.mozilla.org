/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import { IntlProvider } from 'react-intl';
import routes from './routes.jsx';
import queryParser from '../scripts/queryParser.js';
import langURLParser from '../scripts/langURLParser.js';

function createElement(Component, props) {
  var queryString = props.location.query;
  var queryData = queryParser(queryString, props.location.pathname);
  return (
    <IntlProvider locale={queryData.locale} messages={queryData.messages}>
      <Component {...queryData} {...props}/>
    </IntlProvider>
  );
}

function onEnter(nextState, replaceState) {
  var pathname = langURLParser(nextState.location);
  if (pathname) {
    replaceState({}, pathname);
  }
}

ReactDOM.render(
  <Router createElement={createElement} history={createHistory()}>
    <Route onEnter={onEnter}>
      {routes}
    </Route>
  </Router>,
  document.querySelector("#my-app")
);
