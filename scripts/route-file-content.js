import React from 'react';
import Router from 'react-router';
import routes from '../components/routes.jsx';
import currencies from '../data/currencies.js';
import {localeCurrencyData, localeCountryData} from '../data/locale-data.js';
import url from 'url';
import locales from '../public/locales.json';
var Path = require('path');
var FS = require("q-io/fs");
var englishStrings = locales["en-US"] || {};

module.exports = function(outputPath, callback) {
  Router.run(routes, outputPath, function(Handler) {
    var locale = url.parse(outputPath).pathname.split('/')[1];
    var currencyCode = localeCurrencyData[locale] || 'usd';
    var country = localeCountryData[locale] || 'US';
    var favicon = "/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico";
    var twitterImage = "/assets/images/EOY_Twitter_v8_EN.d1bb5d2a5ce35859d038df852d9e6a0a811beaac.png";
    var facebookImage = "/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png";
    var siteUrl = locale + '/';
    var values = {
      currency: currencies[currencyCode],
      presets: currencies.usd.presets.single,
      amount: '',
      frequency: 'single',
      country: country
    };
    var index = React.createFactory(require('../pages/index.jsx'));
    var page = React.createFactory(Handler);
    var currentStrings, mergedStrings;
    if (locale && locales[locale]) {
      currentStrings = locales[locale];
      mergedStrings = Object.assign({}, englishStrings, currentStrings);
      values = Object.assign({}, {locales : [locale], messages: mergedStrings}, values);
    } else {
      locale = 'en-US';
      values = Object.assign({}, {locales : [locale], messages: englishStrings}, values);
    }
    var desc = values.messages.i_donated_to_mozilla;
    if (outputPath.indexOf('thunderbird') !== -1) {
      favicon = "/assets/images/thunderbird/favicon.ico";
      desc = values.messages.i_donated_to_thunderbird;
      twitterImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
      facebookImage = "/assets/images/thunderbird/TorontoSummit2014m.12923cab901787ca8681718646196167.jpg";
      siteUrl += "thunderbird/";
    }
    FS.makeTree(Path.join(__dirname, '..', 'public', outputPath)).then(function() {
      var contentOfTheFile = React.renderToStaticMarkup(index({
        localeInfo: locale,
        favicon,
        metaData: {
          current_url: outputPath,
          desc: desc,
          title: values.messages.support_mozilla,
          site_name: 'mozilla.org',
          site_url: url.resolve(process.env.APPLICATION_URI, siteUrl),
          site_title: values.messages.give_to_mozilla,
          facebook_image: process.env.APPLICATION_URI + facebookImage,
          twitter_image: process.env.APPLICATION_URI + twitterImage
        },
        markup: React.renderToString(page(values))
      }));

      var nameOfTheFile = Path.join(__dirname, '..', 'public', outputPath, 'index.html');

      FS.write(nameOfTheFile, contentOfTheFile).then(function() {
        callback(undefined, nameOfTheFile);
      }).catch(function(err) {
        callback(err);
      });
    }).catch(function(e) {
      console.log(e);
    });
  });
};
