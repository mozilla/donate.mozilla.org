/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';
import routes from '../routes.js';
import currencies from '../data/currencies.js';
import {localeCurrencyData, localeCountryData} from '../data/locale-data.js';
import url from 'url';
import locales from '../../public/locales.json';
var Path = require('path');
var FS = require("q-io/fs");
var englishStrings = locales["en-US"] || {};

function routeFileContent(location, callback) {
  match({routes, location}, function(error, redirectLocation, renderProps) {
    var locale = url.parse(location).pathname.split('/')[1];

    var currencyCode = localeCurrencyData[locale] || 'usd';
    var country = localeCountryData[locale] || 'US';
    var favicon = "/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico";
    var twitterImage = "/assets/images/EOY_Twitter_v8_EN.d1bb5d2a5ce35859d038df852d9e6a0a811beaac.png";
    var facebookImage = "/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png";
    var siteUrl = locale + '/';
    var localesInfo = [];
    var values = {
      currency: currencies[currencyCode],
      presets: currencies.usd.presets.single,
      amount: '',
      frequency: 'single',
      country: country
    };

    var currentStrings, mergedStrings;
    if (locale && locales[locale]) {
      currentStrings = locales[locale];
      localesInfo = [locale];
      mergedStrings = Object.assign({}, englishStrings, currentStrings);
      values = Object.assign({}, {locale: locale, messages: mergedStrings}, values);
    } else {
      localesInfo = Object.keys(locales);
      values = Object.assign({}, {locale: 'en-US', messages: englishStrings}, values);
    }
    var desc = values.messages.i_donated_to_mozilla;
    if (location.indexOf('thunderbird') !== -1) {
      favicon = "/assets/images/thunderbird/favicon.ico";
      desc = values.messages.i_donated_to_thunderbird;
      twitterImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
      facebookImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
      siteUrl += "thunderbird/";
    }

    function createElement(Component, props) {
      // make sure you pass all the props in!
      return (
        <IntlProvider locale={values.locale} messages={values.messages}>
          <Component {...props} {...values} />
        </IntlProvider>
      );
    }

    var Index = require('../pages/index.js');
    var dirPath = Path.join(__dirname, '..', '..', 'public', location);
    FS.makeTree(dirPath).then(function() {
      var reactHTML = ReactDOMServer.renderToString(
        <RouterContext createElement={createElement} {...renderProps}/>
      );
      var contentOfTheFile = ReactDOMServer.renderToStaticMarkup(
        <Index
          localesInfo={localesInfo}
          locale={locale}
          favicon={favicon}
          metaData={{
            current_url: location,
            desc: desc,
            title: values.messages.support_mozilla,
            site_name: 'mozilla.org',
            site_url: url.resolve(process.env.APPLICATION_URI, siteUrl),
            site_title: values.messages.give_to_mozilla,
            facebook_image: process.env.APPLICATION_URI + facebookImage,
            twitter_image: process.env.APPLICATION_URI + twitterImage
          }}
          markup={reactHTML}
        />
      );
      var nameOfTheFile = Path.join(dirPath, 'index.html');

      FS.write(nameOfTheFile, contentOfTheFile).then(function() {
        callback(undefined, nameOfTheFile);
      }).catch(function(err) {
        callback(err);
      });
    }).catch(function(e) {
      console.log(e);
    });
  });
}


module.exports = routeFileContent;
