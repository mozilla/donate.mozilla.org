var webpack = require('webpack');
var SimpleHtmlPrecompiler = require('simple-html-precompiler');
var path = require('path');
var React = require('react');
require('babel/register');
var Router = require('react-router');
var routes = require('./components/routes.jsx');
var paths = require('./scripts/paths.js');
var englishStrings = require('./locales/en-US.json');

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
    { test: /\.jsx$/, loaders: ['babel-loader'] },
    { test: /\.json$/, loaders: ['json-loader'] }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
        COINBASE_ENDPOINT: JSON.stringify(process.env.COINBASE_ENDPOINT),
        OPTIMIZELY_ID: JSON.stringify(process.env.OPTIMIZELY_ID),
        OPTIMIZELY_ACTIVE: JSON.stringify(process.env.OPTIMIZELY_ACTIVE),
        FULL_SUBDOMAIN_FOR_COOKIE: JSON.stringify(process.env.FULL_SUBDOMAIN_FOR_COOKIE)
      }
    }),
    new SimpleHtmlPrecompiler(paths, function(outputPath, callback) {
      Router.run(routes, outputPath, function (Handler, state) {
        var values = {};
        var index = React.createFactory(require('./pages/index.jsx'));
        var page = React.createFactory(Handler);

        if(state.params.locale && require('./locales/index.js').indexOf(state.params.locale) !== -1) {
          var currentString = require('./locales/' + state.params.locale +'.json');
          var mergedStrings = Object.assign(englishStrings, currentString);
          values = Object.assign({locales : [state.params.locale], messages: mergedStrings}, values);
        } else {
          values = Object.assign({locales : ['en-US'], messages: englishStrings}, values);
        }
        callback(React.renderToStaticMarkup(index({
          markup: React.renderToStaticMarkup(page(values))
        })));
      });
    })
  ]
};
