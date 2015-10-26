require('habitat').load();
require('babel/register');
var webpack = require('webpack');
var SimpleHtmlPrecompiler = require('simple-html-precompiler');
var Path = require('path');
var paths = require('./scripts/paths.js');
var routeFileContent = require('./scripts/route-file-content.js');

module.exports = {
  entry: './components/client.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: Path.join('public')
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
      routeFileContent(outputPath, callback);
    })
  ]
};
