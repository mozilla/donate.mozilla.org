require('habitat').load();
require('babel-core/register');
var webpack = require('webpack');
var Path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var moduleDetectRegEx = new RegExp(`.jsx$`);

if (process.env.NPM_CONFIG_PRODUCTION !== `true`) {
  // Remove all files from the module cache that are in the view folder.
  Object.keys(require.cache).map((module) => {
    if (moduleDetectRegEx.test(require.cache[module].filename)) {
      console.log(`Clear cache file for: `, require.cache[module].filename);
      delete require.cache[module];
    }
  });
}
module.exports = {
  entry: ['./components/client.jsx','./less/index.less'],
  output: {
    filename: '[name].[hash].js',
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
      { test: /\.json$/, loaders: ['json-loader'], exclude: ['node_modules'] },
      { test: /\.less$/, loader: ExtractTextPlugin.extract(
                    'css?sourceMap!less?sourceMap'
                ), exclude: ['node_modules'] }
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
    new AssetsPlugin({
      path: Path.join(__dirname, "public")
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        APPLICATION_URI: process.env.APPLICATION_URI,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
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
    new ExtractTextPlugin("style.[hash].css", {
      allChunks: true
    })
  ]
};
