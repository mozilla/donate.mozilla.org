/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import { IntlProvider, addLocaleData } from 'react-intl';
import routes from './routes.jsx';
import queryParser from '../scripts/queryParser.js';
import langURLParser from '../scripts/langURLParser.js';

function createElement(Component, props) {
  var queryString = props.location.query;
  var queryData = queryParser(queryString, props.location.pathname);
  var ReactIntlLocaleData = window.ReactIntlLocaleData;

  Object.keys(ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(ReactIntlLocaleData[lang]);
  });

  return (
    <IntlProvider locale={queryData.locale} messages={queryData.messages}>
      <Component {...queryData} {...props}/>
    </IntlProvider>
  );
}

function onEnter(nextState, replaceState) {
  var pathname = langURLParser(nextState.location);
  var query = nextState.location.query;
  if (pathname) {
    if (query.redirect) {
      pathname += query.query;
      query = {};
    }
    replaceState({}, pathname, query);
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
