import React from 'react';
import Router from 'react-router';
import currencies from '../data/currencies.js';
import routes from './routes.jsx';
require('whatwg-fetch');
import i18n from '../locales/i18n.js';
import assign from 'react/lib/Object.assign';
import paths from '../scripts/paths.js';

function redirectTo(pathname, query, Handler) {
  // we need to check if the requested path exists in our paths list
  // if not redirect to root which is better than showing blank page
  if(paths.indexOf(pathname) === -1) {
    Handler.transitionTo('/');
  } else {
    Handler.transitionTo(pathname, {}, query)
  }
}

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var values = {};
  var pathname = state.query.pathname || state.pathname;
  var lang = i18n.isSupportedLanguage(i18n.currentLanguage) ? i18n.currentLanguage : i18n.defaultLang;
  var query = state.query.pathname ? {} : state.query;
  if(state.params.currency) {
    values = currencies[state.params.currency];
  }

  // checking if language code is part of the URL e.g. /en-US/thank-you
  if(i18n.urlOverrideLang(state.query.pathname).test) {
    // but is the language code supported in our app?
    if(i18n.isSupportedLanguage(i18n.urlOverrideLang().lang)) {
      var messages = i18n.intlDataFor(i18n.urlOverrideLang().lang);
      values = assign(values, messages);
    } else {
      pathname = pathname.split('/')[2] ? pathname.split('/')[2] : '';
      return redirectTo(pathname, query, Handler)
    }
    // if not we will hijack the URL and insert the language code in the URL
  } else if(!i18n.urlOverrideLang(state.query.pathname).test) {
    return redirectTo("/" + lang + pathname, query, Handler)
  }
  React.render(<Handler {...values} />, document.querySelector("#my-app"));
});
