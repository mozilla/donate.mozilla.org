import url from 'url';
import React from 'react';
import Parser from "accept-language-parser";
import bestLang from 'bestlang';
import ReactDOM, { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import {IntlProvider} from 'react-intl';
import routes from '../components/routes.jsx';
import listPages from './paths.js';
import listLocales from '../locales/index.js';
import queryParser from './queryParser.js';

function makeFile(renderProps, query, callback) {
  var values = queryParser(query, renderProps.location.pathname);
  var intlData = {messages: values.messages, locale: values.locale};
  var Index = React.createFactory(require('../pages/index.jsx'));
  var favicon = "/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico";

  function createElement(Component, props) {
    // make sure you pass all the props in!
    return <Component {...props} {...values} />;
  }

  var props = {
    metaData: {
      favicon,
      current_url: renderProps.location.pathname,
      site_name: 'mozilla.org',
      site_url: url.resolve(process.env.APPLICATION_URI, values.locale + '/'),
      APPLICATION_URI: process.env.APPLICATION_URI
    }
  };

  return ReactDOM.renderToString(<IntlProvider key="intl" {...intlData}><Index {...props}>{renderToString(<IntlProvider key="intl" {...intlData} ><RouterContext createElement={createElement} {...renderProps} /></IntlProvider>)}</Index></IntlProvider>);
}
module.exports = (request, reply) => {
  function replyContent(redirect, content) {
    let query = '';
    if (request.url.search) {
      query = request.url.search;
    }
    if (redirect) {
      return reply.redirect(`${redirect}${query}`);
    }
    reply(content).type('text/html; charset=utf-8').vary('User-Agent');
  }
  match({ routes, location: request.url.pathname }, (error, redirectLocation, renderProps) => {
    if (!renderProps) {
      let header = Parser.parse(request.headers["accept-language"]);
      let languages_array = header.map(function(l) {
        return l.code + (l.region ? "-" + l.region : "");
      });
      let locale = bestLang(languages_array, listLocales, 'en-US');
      let pathname = redirectLocation && redirectLocation.pathname;
      let localeInPath = pathname.split('/')[1];
      let supportedLocale = listLocales.indexOf(localeInPath) !== -1;
      let pageFound = listPages.indexOf(pathname) !== -1;

      if (pageFound) {
        if (localeInPath && supportedLocale) {
          return reply(`${pathname}`);
        }
        return replyContent(`/${locale}${pathname}`);
      }
      if (!pageFound) {
        if (supportedLocale) {
          return replyContent(`/${localeInPath}/`);
        }
        return replyContent(`/${locale}/`);
      }
    } else if (renderProps) {
      replyContent(null, makeFile(renderProps, request.url.query || {}));
    }
  });
};
