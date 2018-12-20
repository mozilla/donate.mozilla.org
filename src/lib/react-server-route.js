/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import url from 'url';
import queryParser from './queryParser.js';
var langmap = require("langmap");
var IndexPage = require('../pages/index.js');

function routeFileContent(locales) {
  var locationParser = require('./location-parser.js')(langmap, locales);
  return function(request, h) {
    var reactDOM = require("react-dom/server");
    var renderToString = reactDOM.renderToString;
    var renderToStaticMarkup = reactDOM.renderToStaticMarkup;
    var routes = require('../routes.js');
    var reactRouter = require('react-router');
    var match = reactRouter.match;
    var RouterContext = reactRouter.RouterContext;
    var getMessages = require('./get-messages.js');
    var CreateElement = require('../components/create-element.js');

    var location = url.parse(request.url).pathname;
    location = encodeURI(location);
    var search = url.parse(request.url).search || "";
    var parsedLocation = locationParser(request.headers["accept-language"], location);
    var parsedRedirect = parsedLocation.redirect;
    var locale = parsedLocation.locale;

    function generateHTML(renderProps, userAgentString) {
      var messages = getMessages(locale);
      var favicon = "/assets/images/favicon.d0608f227db61f2852a32087e614911c.png";
      var twitterImage = "/assets/images/twitter-card-generic.png";
      var facebookImage = "/assets/images/og.jpg";
      var siteUrl = locale + '/';
      var localesInfo = [locale];
      var query = queryParser(request.query);
      var desc = messages.i_donated_to_mozilla_2017;
      if (/^(en)(\b|$)/.test(locale)) {
        twitterImage = "/assets/images/twitter-card-en.png";
      }
      if (/^(fr|de)(\b|$)/.test(locale)) {
        twitterImage = "/assets/images/twitter-card-" + locale + ".png";
      }
      if (location.indexOf('thunderbird') !== -1) {
        favicon = "/assets/images/thunderbird/favicon.ico";
        desc = messages.i_donated_to_thunderbird;
        twitterImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
        facebookImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
        siteUrl += "thunderbird/";
      }

      function createElement(Component, props) {
        // make sure you pass all the props in!
        return (
          <CreateElement {...query.initialState} locale={locale} messages={messages}>
            <Component {...props} {...query.values} />
          </CreateElement>
        );
      }

      // renderToString() generates React-properties-enriched HTML that a
      // React app can be loaded into. There's also renderToStaticMarkup(),
      // but that generates HTML without any React properties, so that _would_
      // get wiped if the HTML contains a <script> element that tries to load
      // the bundle for hooking into the DOM.
      var reactHTML = renderToString(<RouterContext createElement={createElement} {...renderProps}/>);
      var html = renderToStaticMarkup(
        <IndexPage
          localesInfo={localesInfo}
          locale={locale}
          favicon={favicon}
          metaData={{
            current_url: location,
            user_agent: userAgentString,
            desc: desc,
            title: messages.support_mozilla,
            site_name: 'mozilla.org',
            site_url: url.resolve(process.env.APPLICATION_URI, siteUrl),
            site_title: messages.give_to_mozilla,
            facebook_image: process.env.APPLICATION_URI + facebookImage,
            twitter_image: process.env.APPLICATION_URI + twitterImage,
          }}
          markup={reactHTML}
        />
      );

      // And to be good citizens of the web, we need a doctype, which React
      // cannot generate for us because exclamation points are funny.
      return "<!doctype html>" + html;
    }

    return new Promise(function(resolve, reject) {
      match({routes, location}, function(error, redirectLocation, renderProps) {

        if (error) {
          return reject(h.response(error.message).code(500));
        }

        if (parsedRedirect) {
          return resolve(h.redirect(`/${locale}${parsedRedirect}${search}`));
        }
        // React router lets you specify redirects. If we had any, we literally
        // just tell our server that we need to look up a different URL.
        else if (redirectLocation) {
          return resolve(h.redirect(`${redirectLocation.pathname}/${search}`));
        }
        // This is the most interesting part: we have content that React can render.
        else if (renderProps) {

          if (location === "/") {
            resolve(h.redirect(`${location}${locale}/${search}`));
          } else {
            // Finally, send a full HTML document over to the client
            resolve(generateHTML(renderProps, request.headers['user-agent'])).type('text/html').code(200);
          }
        }
      });
    });
  };
}


module.exports = routeFileContent;
