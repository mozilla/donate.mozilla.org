/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { IntlProvider, addLocaleData } from 'react-intl';
import routes from './routes.js';
import queryParser from './lib/queryParser.js';
import redirectURLParser from './lib/redirectURLParser.js';

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
  var result = redirectURLParser(nextState.location);
  if (!result.pathname) {
    return;
  }
  if (result.query) {
    replaceState({pathname: result.pathname, query: result.query});
  } else {
    replaceState(result.pathname);
  }
}

ReactDOM.render(
  <Router createElement={createElement} history={browserHistory}>
    <Route onEnter={onEnter}>
      {routes}
    </Route>
  </Router>,
  document.querySelector("#my-app")
);
