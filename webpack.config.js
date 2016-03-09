require('habitat').load();
require('babel-core/register');
var webpack = require('webpack');
var SimpleHtmlPrecompiler = require('./scripts/simple-html-plugin.js');
var Path = require('path');
var paths = require('./scripts/paths.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var exclude = [
  Path.join(__dirname, "node_modules/react/dist/react.min.js"),
  Path.join(__dirname, "node_modules/react-intl/dist/react-intl.min.js"),
  Path.join(__dirname, "node_modules/react-router/umd/ReactRouter.min.js"),
  Path.join(__dirname, "node_modules/react-ga/dist/index.min.js"),
  'node_modules'
];
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
    noParse: [
      Path.join(__dirname, "node_modules/react/dist/react.min.js"),
      Path.join(__dirname, "node_modules/react-intl/dist/react-intl.min.js"),
      Path.join(__dirname, "node_modules/react-router/umd/ReactRouter.min.js"),
      Path.join(__dirname, "node_modules/react-ga/dist/index.min.js"),
      Path.join(__dirname, "pages/sequential.jsx")
    ],
    loaders: [
      { test: /\.js$/, loaders:  ['babel-loader'], exclude: exclude },
      { test: /\.jsx$/, loaders: ['babel-loader'], exclude: exclude },
      { test: /\.json$/, loaders: ['json-loader'], exclude: exclude },
      { test: /\.less$/, loader: ExtractTextPlugin.extract(
                    'css?sourceMap!less?sourceMap'
                ), exclude: exclude }
    ],
    preLoaders: [
      { test: /\.jsx$/, loaders: ['eslint-loader'], exclude: exclude }
    ]
  },
  resolve: {
    alias: {
      "react$": Path.join(__dirname, "node_modules/react/dist/react.min.js"),
      "react-intl$": Path.join(__dirname, "node_modules/react-intl/dist/react-intl.min.js"),
      "react-router$": Path.join(__dirname, "node_modules/react-router/umd/ReactRouter.min.js"),
      "react-ga$": Path.join(__dirname, "node_modules/react-ga/dist/index.min.js")
    }
  },
  eslint: {
    emitError: true,
    emitWarning: true
  },
  devtool: 'inline-eval-cheap-source-map',
  plugins: [
    new AssetsPlugin({
      path: Path.join(__dirname, "public")
    }),
    new webpack.PrefetchPlugin("./mixins/form.jsx"),
    new webpack.PrefetchPlugin("./assets/js/analytics.js"),
    new webpack.PrefetchPlugin("./data/pages.js"),
    new webpack.PrefetchPlugin("./less/index.less"),
    new webpack.PrefetchPlugin("./pages/one-page.jsx"),
    new webpack.PrefetchPlugin("./pages/sequential.jsx"),
    new webpack.PrefetchPlugin("./pages/paypal-donate.jsx"),
    new webpack.PrefetchPlugin("./public/locales.json"),
    new webpack.PrefetchPlugin("./components/client.jsx"),
    new webpack.PrefetchPlugin("./scripts/langURLParser.js"),
    new webpack.PrefetchPlugin("./scripts/queryParser.js"),
    new webpack.PrefetchPlugin("./locales/i18n.js"),
    new webpack.PrefetchPlugin("./pages/share.jsx"),
    new webpack.PrefetchPlugin("./pages/thunderbird/one-page.jsx"),
    new webpack.PrefetchPlugin("./pages/thank-you.jsx"),
    new webpack.PrefetchPlugin("./pages/thunderbird/thank-you.jsx"),
    new webpack.PrefetchPlugin("./components/footer-mozilla.jsx"),
    new webpack.PrefetchPlugin("./components/small-print.jsx"),
    new webpack.PrefetchPlugin("./components/name-input.jsx"),
    new webpack.PrefetchPlugin("./components/donation-frequency.jsx"),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        APPLICATION_URI: process.env.APPLICATION_URI,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        OPTIMIZELY_ID: process.env.OPTIMIZELY_ID,
        OPTIMIZELY_ACTIVE: process.env.OPTIMIZELY_ACTIVE,
        FULL_SUBDOMAIN_FOR_COOKIE: process.env.FULL_SUBDOMAIN_FOR_COOKIE,
        PAYPAL_EMAIL: process.env.PAYPAL_EMAIL,
        PAYPAL_ENDPOINT: process.env.PAYPAL_ENDPOINT,
        NODE_ENV: '"production"'
      })
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin("style.[hash].css", {
      allChunks: true
    }),
    new SimpleHtmlPrecompiler(paths)
  ]
};
