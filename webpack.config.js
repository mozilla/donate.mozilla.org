var webpack = require('webpack');
var SimpleHtmlPrecompiler = require('simple-html-precompiler');
var path = require('path');
var React = require('react');
require('babel/register');
var Router = require('react-router');
var routes = require('./components/routes.jsx');
var paths = require('./scripts/paths.js');
var englishStrings = require('./locales/en-US.json');
var currencies = require('./data/currencies.js');
var url = require('url');
require('habitat').load();

module.exports = {
  entry: './components/client.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join('public')
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders:  ['babel-loader'], exclude: ['node_modules'] },
      { test: /\.jsx$/, loaders: ['babel-loader'], exclude: ['node_modules'] },
      { test: /\.json$/, loaders: ['json-loader'], exclude: ['node_modules'] }
    ],
    preLoaders: [
      { test: /\.jsx$/, loaders: ['eslint-loader'], exclude: ['node_modules'] }
    ]
  },
  eslint: {
    emitError: true,
    emitWarning: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        APPLICATION_URI: process.env.APPLICATION_URI,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        COINBASE_ENDPOINT: process.env.COINBASE_ENDPOINT,
        OPTIMIZELY_ID: process.env.OPTIMIZELY_ID,
        OPTIMIZELY_ACTIVE: process.env.OPTIMIZELY_ACTIVE,
        FULL_SUBDOMAIN_FOR_COOKIE: process.env.FULL_SUBDOMAIN_FOR_COOKIE,
        PAYPAL_EMAIL: process.env.PAYPAL_EMAIL,
        PAYPAL_ENDPOINT: process.env.PAYPAL_ENDPOINT
      })
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.ContextReplacementPlugin(/buffer/, require('buffer')),
    new SimpleHtmlPrecompiler(paths, function(outputPath, callback) {
      Router.run(routes, outputPath, function(Handler) {
        var values = {
          currency: currencies.usd,
          presets: currencies.usd.presets.single,
          currencies: currencies,
          amount: '',
          frequency: 'single'
        };
        var index = React.createFactory(require('./pages/index.jsx'));
        var page = React.createFactory(Handler);
        var locale = url.parse(outputPath).pathname.split('/')[1];
        var currentString, mergedStrings;

        if (locale && require('./locales/index.js').indexOf(locale) !== -1) {
          currentString = require('./locales/' + locale +'.json');
          mergedStrings = Object.assign({}, englishStrings, currentString);
          values = Object.assign({}, {locales : [locale], messages: mergedStrings}, values);
        } else {
          locale = 'en-US';
          values = Object.assign({}, {locales : [locale], messages: englishStrings}, values);
        }
        callback(React.renderToStaticMarkup(index({
          localeInfo: locale,
          metaData: {
            desc: values.messages.i_donated_to_mozilla,
            title: values.messages.support_mozilla,
            site_name: 'mozilla.org',
            site_url: url.resolve(process.env.APPLICATION_URI, locale + '/'),
            site_title: values.messages.give_to_mozilla
          },
          markup: React.renderToStaticMarkup(page(values))
        })));
      });
    })
  ]
};
