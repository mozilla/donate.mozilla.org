var SimpleHtmlPrecompiler = require('./plugins/simple-html-precompiler.js');
var path = require('path');
var React = require('react');
require('babel/register');
var Router = require('react-router');
var routes = require('./routes.jsx');
var currencies = require('./currencies.js');
var currenciesArray = Object.keys(currencies);
var paths = ["/", "/thank-you", "/share", "/paypal-donate-usd"];
currenciesArray.forEach(function(key) {
  var path = '/paypal-donate-' + key;
  paths.push(path);
});

module.exports = {
  entry: "./client.jsx",

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
      { test: /\.jsx$/, loaders: ['babel-loader'] },
      { test: /\.json$/, loaders: ['json-loader'] }
    ]
  },

  plugins: [
    new SimpleHtmlPrecompiler(paths, function(outputPath, callback) {
      Router.run(routes, outputPath, function (Handler, state) {
        var Index = React.createFactory(require('./pages/index.jsx'));
        var Page = React.createFactory(Handler);
        var values = {};
        if (currencies[state.params.currency]) {
          values = currencies[state.params.currency];
        }
        callback(React.renderToString(Index({
          markup: React.renderToString(Page(values))
        })));
      });
    })
  ]
};
