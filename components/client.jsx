import React from 'react';
import { render } from 'react-dom';
import { match, Router } from 'react-router';
import {IntlProvider,addLocaleData} from 'react-intl';
import { createHistory, useQueries } from 'history';
import routes from './routes.jsx';
import queryParser from '../scripts/queryParser.js';

const history = useQueries(createHistory)();

match({routes, history }, (error, redirectLocation, renderProps) => {
  function createElement(Component, props) {
    // make sure you pass all the props in!
    return <Component {...props} {...queryParser(renderProps.location.query, renderProps.location.pathname)} />;
  }

  let locale = Object.keys(window.ReactIntlLocaleData)[0];
  addLocaleData(window.ReactIntlLocaleData[locale]);
  render(
      <IntlProvider key="intl" {...queryParser(renderProps.location.query, renderProps.location.pathname)}>
        <Router createElement={createElement} {...renderProps} />
      </IntlProvider>, document.getElementById(`my-app`)
    );
});
