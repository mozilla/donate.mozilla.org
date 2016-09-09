/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';
import routes from '../routes.js';
import currencies from '../data/currencies.js';
import {localeCurrencyData, localeCountryData} from '../data/locale-data.js';
import url from 'url';
import locales from '../../public/locales.json';
var langmap = require("langmap");
var locationParser = require('./location-parser.js')(langmap);
var HTML = require('../pages/index.js');

function routeFileContent(request, reply) {
  var location = url.parse(request.url).pathname;
  var search = url.parse(request.url).search || "";
  var parsedLocation = locationParser(request.headers["accept-language"], location);
  var parsedRedirect = parsedLocation.redirect;
  var locale = parsedLocation.locale;

  function generateHTML(renderProps) {
    var messages = Object.assign({}, locales["en-US"], locales[locale]);
    var currencyCode = localeCurrencyData[locale] || 'usd';
    var country = localeCountryData[locale] || 'US';
    var favicon = "/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico";
    var twitterImage = "/assets/images/EOY_Twitter_v8_EN.d1bb5d2a5ce35859d038df852d9e6a0a811beaac.png";
    var facebookImage = "/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png";
    var siteUrl = locale + '/';
    var localesInfo = [locale];
    var values = {
      currency: currencies[currencyCode],
      presets: currencies.usd.presets.single,
      amount: '',
      frequency: 'single',
      country: country
    };
    var desc = messages.i_donated_to_mozilla;
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
        <IntlProvider locale={locale} messages={messages}>
          <Component {...props} {...values} />
        </IntlProvider>
      );
    }

    // renderToString() generates React-properties-enriched HTML that a
    // React app can be loaded into. There's also renderToStaticMarkup(),
    // but that generates HTML without any React properties, so that _would_
    // get wiped if the HTML contains a <script> element that tries to load
    // the bundle for hooking into the DOM.
    var reactHTML = renderToString(<RouterContext createElement={createElement} {...renderProps}/>);
    var html = renderToStaticMarkup(
      <HTML
        localesInfo={localesInfo}
        locale={locale}
        favicon={favicon}
        metaData={{
          current_url: location,
          desc: desc,
          title: messages.support_mozilla,
          site_name: 'mozilla.org',
          site_url: url.resolve(process.env.APPLICATION_URI, siteUrl),
          site_title: messages.give_to_mozilla,
          facebook_image: process.env.APPLICATION_URI + facebookImage,
          twitter_image: process.env.APPLICATION_URI + twitterImage
        }}
        markup={reactHTML}
      />
    );

    // And to be good citizens of the web, we need a doctype, which React
    // cannot generate for us because exclamation points are funny.
    return "<!doctype html>" + html;
  }

  match({routes, location}, function(error, redirectLocation, renderProps) {

    if (error) {
      reply(error.message).code(500);
      return;
    }

    if (parsedRedirect) {
      reply().redirect("/" + locale + parsedRedirect + search);
    }
    // React router lets you specify redirects. If we had any, we literally
    // just tell our server that we need to look up a different URL.
    else if (redirectLocation) {
      reply().redirect(redirectLocation.pathname + "/" + search);
    }
    // This is the most interesting part: we have content that React can render.
    else if (renderProps) {

      if (location === "/") {
        reply().redirect(location + locale + "/" + search);
      } else {
        // Finally, send a full HTML document over to the client
        reply(generateHTML(renderProps)).type('text/html').code(200);
      }
    }
  });
}


module.exports = routeFileContent;
