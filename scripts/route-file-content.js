import url from 'url';
import React from 'react';
import Parser from "accept-language-parser";
import bestLang from 'bestlang';
import ReactDOM, { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import {IntlProvider} from 'react-intl';
import routes from '../components/routes.jsx';
import locales from '../public/locales.json';
import queryParser from './queryParser.js';
import langmap from 'langmap';

function addTrailingSlash(pathname) {
  // If there is a trailing slash this should do nothing.
  return pathname.replace(/\/?$/, '/');
}

function redirectMatch(error, redirectLocation, renderProps, pathname, request, reply) {
  if (renderProps && !renderProps.params.locale) {
    replyContent(request, reply, pathname);
    return;
  }

  let localeParam = '';
  if (redirectLocation && pathname !== '/') {
    localeParam = redirectLocation && redirectLocation.pathname.split('/')[1];
  } else if (!redirectLocation && renderProps.params && renderProps.params.locale) {
    localeParam = renderProps.params.locale;
  }

  // sometime people trying to pass in some garbage and intentionally want to break our code
  // check `bad-actors-test.js` file for example. This will at least prevent that from happening
  // without throwing an error or redirect loop.
  localeParam = encodeURI(localeParam);
  let header = Parser.parse(request.headers["accept-language"]);
  let languages_array = header.map(l => l.code + (l.region ? "-" + l.region : ""));
  let locale = bestLang(languages_array, Object.keys(locales), 'en-US');
  let localeInPath = langmap[localeParam];
  let supportedLocale = false;

  if (localeInPath && locales[localeParam]) {
    supportedLocale = true;
  }

  if (localeInPath && !supportedLocale) {
    // e.g. /xx/thank-you/ we want to redirect to /en-US/thank-you/
    pathname = pathname.replace(localeParam, locale);
    pathname = addTrailingSlash(pathname);
  } else if (!localeInPath) {
    // if locale is not in path or the first section of the URL is not an actual locale
    // let's cache the old path first...
    let oldPath = pathname;
    // we are going to add a locale to see if this path does exists in our routes object
    pathname = `/${locale}${pathname}`;
    match({ routes, location: pathname }, (error, redirectLocation, renderProps) => {
      if (!renderProps) {
        // the path doesn't exist, let's try and replace it with our own locale, and proceed to the next match
        pathname = oldPath.replace(localeParam, locale);
      }
    });
  }

  pathname = addTrailingSlash(pathname);
  // this should be our final match, and if we don't have the path in our routes, we will redirect to homepage
  match({ routes, location: pathname }, (error, redirectLocation, renderProps) => {
    if (!renderProps) {
      replyContent(request, reply, `/${locale}/`);
      return;
    }

    replyContent(request, reply, pathname);
    return;
  });
}

function makeFile(renderProps, query) {
  var values = queryParser(query, renderProps.location.pathname);
  var intlData = {defaultMessage: values.messages, messages: values.messages, locale: values.locale};
  var Index = React.createFactory(require('../pages/index.jsx'));
  var favicon = "/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico";

  function createElement(Component, props) {
    // make sure you pass all the props in!
    return <Component {...props} {...values} />;
  }

  if (renderProps.location.pathname.indexOf('thunderbird') !== -1) {
    favicon = "/assets/images/thunderbird/favicon.ico";
  }

  var props = {
    favicon,
    metaData: {
      current_url: renderProps.location.pathname,
      site_name: 'mozilla.org',
      site_url: url.resolve(process.env.APPLICATION_URI, values.locale + '/'),
      APPLICATION_URI: process.env.APPLICATION_URI
    },
    markup: renderToString(<IntlProvider key="intl" {...intlData} ><RouterContext createElement={createElement} {...renderProps} /></IntlProvider>)
  };

  return ReactDOM.renderToString(<IntlProvider key="intl" {...intlData}><Index {...props}></Index></IntlProvider>);
}

function replyContent(request, reply, redirect, content) {
  let query = '';
  if (request.url.search) {
    query = request.url.search;
  }

  if (redirect) {
    return reply.redirect(`${redirect}${query}`);
  }
  reply(content).type('text/html; charset=utf-8').vary('User-Agent');
}

module.exports = (request, reply) => {
  let pathname = request.url.pathname;

  match({ routes, location: pathname }, (error, redirectLocation, renderProps) => {
    if (renderProps && !renderProps.params.locale) {
      replyContent(request, reply, null, makeFile(renderProps, request.url.query || {}));
      return;
    }

    if ((!redirectLocation || !redirectLocation.pathname) && renderProps && renderProps.params && !renderProps.params.locale) {
      return;
    }
    let pathname = redirectLocation && redirectLocation.pathname || renderProps && renderProps.location.pathname;

    // We need to redirect, but before redirecting them, let's see if we have this pathname in the routes.
    match({ routes, location: pathname }, function(error, redirectLocation, renderProps) {
      redirectMatch(error, redirectLocation, renderProps, pathname, request, reply);
    });
  });
};
