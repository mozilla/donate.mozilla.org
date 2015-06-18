var SimpleHtmlPrecompiler = require('simple-html-precompiler');
var path = require('path');
var React = require('react');
require('babel/register');
var Router = require('react-router');

var routes = require('./routes.jsx');
var currencies = require('./currencies.js').currencies;

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
    new SimpleHtmlPrecompiler(routes.paths, function(outputPath, callback) {
      Router.run(routes.routes, outputPath, function (Handler, state) {
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
