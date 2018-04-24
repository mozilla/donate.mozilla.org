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
    path: Path.join( __dirname, './public')
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader', exclude: ['node_modules'] },
      { test: /\.jsx$/, enforce: 'pre', loader: 'eslint-loader', exclude: ['node_modules'] },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
      path: Path.join(__dirname, 'public')
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin("style.[hash].css", {
      allChunks: true
    }),
    new WebpackOnBuildPlugin(function(stats) {
      console.log('\n------------------------------------------');
      console.log(' Build complete. To access the server,');
      console.log(' open http://' + process.env.HOST + ':' + process.env.PORT, 'in a browser.');
      console.log('------------------------------------------');
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
