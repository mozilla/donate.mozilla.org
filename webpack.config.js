var SimpleHtmlPrecompiler = require('./plugins/simple-html-precompiler.js');
var path = require('path');
var React = require('react');
require('node-jsx').install();
var Router = require('react-router');
var routes = require('./routes.jsx');
var currencies = require('./currencies.js');
var currenciesArray = Object.keys(currencies);
//var currenciesPaths = {};
var paths = ["/", "/thank-you", "/share", "/paypal-donate-usd"];
currenciesArray.forEach(function(key) {
  var path = '/paypal-donate-' + key;
  paths.push(path);
  //currenciesPaths[path] = currencies[key];
});

module.exports = {
  entry: "./client.jsx",

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join('public')
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['jsx-loader'] },
      { test: /\.json$/, loaders: ['json-loader'] }
    ]
  },

  plugins: [
    new SimpleHtmlPrecompiler(paths, function(outputPath, callback) {
      Router.run(routes, outputPath, function (Handler) {
        var Index = React.createFactory(require('./pages/index.jsx'));
        var Page = React.createFactory(Handler);
        callback(React.renderToString(Index({
          markup: React.renderToString(Page())
        })));
      });
    })
  ]
};
