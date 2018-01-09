/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { addLocaleData } from 'react-intl';
import routes from './routes.js';
import queryParser from './lib/queryParser.js';
import CreateElement from './components/create-element.js';
import getMessages from './lib/get-messages.js';

function createElement(Component, props) {
  var locale = window.location.pathname.split("/")[1];
  var query = queryParser(props.location.query, locale);
  var ReactIntlLocaleData = window.ReactIntlLocaleData;
  var messages = getMessages(locale);
  process.env = window.__clientenv__;

  Object.keys(ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(ReactIntlLocaleData[lang]);
  });

  return (
    <CreateElement {...query.initialState} locale={locale} messages={messages}>
      <Component {...props} {...query.values} />
    </CreateElement>
  );
}

ReactDOM.render(
  <Router createElement={createElement} history={browserHistory}>
    {routes}
  </Router>,
  document.querySelector("#my-app")
);
