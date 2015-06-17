var Habitat = require('habitat');

Habitat.load();

var env = new Habitat();
var webpack = require('webpack');

// this lets us require files with JSX/ES6 in them
require('babel/register');

var path = require('path');
var React = require('react');
var wrapper = require('./pages/index.jsx');
var Sequential = require('./pages/sequential.jsx');
var ThankYou = require('./pages/thank-you.jsx');
var currencyArray = "usd, php, pln, rub, sek, thb, twd".split(", ");

var getConfig = require('hjs-webpack')

module.exports = getConfig({
  in: './client.jsx',
  out: 'public',
  output: {
    filename: "build/main.js",
    path: path.join(__dirname, 'public')
  },
  hostname: '0.0.0.0',
  port: env.get('WEBPACK_DEV_PORT'),
  isDev: !env.get('NPM_CONFIG_PRODUCTION'),
  html: function (data) {
    var pageWrapper = React.createFactory(wrapper);
    var SequentialPageHtmlString = React.createFactory(Sequential);
    var ThankYouPageHtmlString = React.createFactory(ThankYou);

    var sq = React.renderToStaticMarkup(pageWrapper({
      markup: React.renderToStaticMarkup(SequentialPageHtmlString())
    }));
    var ty = React.renderToStaticMarkup(pageWrapper({
      markup: React.renderToStaticMarkup(ThankYouPageHtmlString())
    }));

    var returnObject = {
      'index.html': sq,
      'thank-you/index.html': ty
    };

    currencyArray.forEach(function(value) {
      var page = React.createFactory(require('./pages/paypal-donate-' + value + '.jsx'))
      returnObject['paypal-donate-' + value + '/index.html'] = React.renderToStaticMarkup(pageWrapper({
        markup: React.renderToStaticMarkup(page())
      }))
    });

    return returnObject;
  }
})
