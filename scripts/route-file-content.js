import React from 'react';
import Router from 'react-router';
import routes from '../components/routes.jsx';
import englishStrings from '../locales/en-US.json';
import currencies from '../data/currencies.js';
import localeCurrency from '../data/locale-currency.js';
import url from 'url';
var fs = require('fs');
var Path = require('path');
var FS = require("q-io/fs");

module.exports = function(outputPath, callback) {
  Router.run(routes, outputPath, function(Handler) {
    var locale = url.parse(outputPath).pathname.split('/')[1];
    var currencyCode = localeCurrency[locale] || 'usd';
    var values = {
      currency: currencies[currencyCode],
      presets: currencies.usd.presets.single,
      currencies: currencies,
      amount: '',
      frequency: 'single'
    };
    var index = React.createFactory(require('../pages/index.jsx'));
    var page = React.createFactory(Handler);
    var currentString, mergedStrings;

    if (locale && require('../locales/index.js').indexOf(locale) !== -1) {
      currentString = require('../locales/' + locale +'.json');
      mergedStrings = Object.assign({}, englishStrings, currentString);
      values = Object.assign({}, {locales : [locale], messages: mergedStrings}, values);
    } else {
      locale = 'en-US';
      values = Object.assign({}, {locales : [locale], messages: englishStrings}, values);
    }
    FS.makeTree(Path.join(__dirname, '..', 'public', outputPath)).then(function() {
      var contentOfTheFile = React.renderToStaticMarkup(index({
        localeInfo: locale,
        metaData: {
          desc: values.messages.i_donated_to_mozilla,
          title: values.messages.support_mozilla,
          site_name: 'mozilla.org',
          site_url: url.resolve(process.env.APPLICATION_URI, locale + '/'),
          site_title: values.messages.give_to_mozilla
        },
        markup: React.renderToStaticMarkup(page(values))
      }));
      fs.writeFileSync(Path.join(__dirname, '..', 'public', outputPath, 'index.html'), contentOfTheFile);
      callback();
    });
  });
};
