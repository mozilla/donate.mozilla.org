/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { IntlProvider, addLocaleData } from 'react-intl';
import routes from './routes.js';
import queryParser from './lib/queryParser.js';
import locales from '../public/locales.json';
import assign from 'object-assign';

function createElement(Component, props) {
  var locale = window.location.pathname.split("/")[1];
  var values = queryParser(props.location.query, locale);
  var ReactIntlLocaleData = window.ReactIntlLocaleData;
  var messages = assign({}, locales['en-US'], locales[locale]);

  Object.keys(ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(ReactIntlLocaleData[lang]);
  });

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Component {...props} {...values} />
    </IntlProvider>
  );
}

ReactDOM.render(
  <Router createElement={createElement} history={browserHistory}>
    {routes}
  </Router>,
  document.querySelector("#my-app")
);
