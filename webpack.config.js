var SimpleHtmlPrecompiler = require('simple-html-precompiler');
var path = require('path');
var React = require('react');
require('babel/register');
var Router = require('react-router');
var routes = require('./components/routes.jsx');
var paths = require('./scripts/paths.js');
var currencies = require('./scripts/currencies.js');

module.exports = {
  entry: "./components/client.jsx",

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
        var values = {};
        var Index = React.createFactory(require('./pages/index.jsx'));
        var Page = React.createFactory(Handler);
        if (currencies[state.params.currency]) {
          values = currencies[state.params.currency];
        }

        if(state.params.locale) {
          values = Object.assign({messages: require(path.join(__dirname, 'locales/' + state.params.locale +'.json'))}, values);
        } else {
          values = Object.assign({messages: require(path.join(__dirname, 'locales/en.json'))}, values);
        }
        callback(React.renderToStaticMarkup(Index({
          markup: React.renderToStaticMarkup(Page(values))
        })));
      });
    })
  ]
};
