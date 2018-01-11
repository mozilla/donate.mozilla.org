require('habitat').load();
var webpack = require('webpack');
var Path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');

module.exports = {
  entry: ['./dist/client.js','./less/index.less'],
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js',
    path: Path.join('public')
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
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
      path: Path.join(__dirname, 'public')
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin("style.[hash].css", {
      allChunks: true
    }),
    new WebpackOnBuildPlugin(function(stats) {
      console.log('\n------------------------------------------');
      console.log(' Build complete. To access the server,');
      console.log(' open http://' + process.env.HOST + ':' + process.env.PORT, 'in a browser.');
      console.log('------------------------------------------');      
    })
  ]
};
